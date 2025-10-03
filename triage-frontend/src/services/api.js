import { analyzeWithGemini, isGeminiConfigured } from './gemini';

// API configuration - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_GEMINI_FIRST = true; // Set to false to always use backend API

/**
 * Call the triage API endpoint (with Gemini AI integration)
 * @param {Object} payload - The triage request payload
 * @param {Object} originalFormData - The original form data (needed for Gemini)
 * @returns {Promise<Object>} - The triage response
 */
export async function callTriageAPI(payload, originalFormData = null) {
  // Try Gemini AI first if configured
  if (USE_GEMINI_FIRST && isGeminiConfigured()) {
    try {
      console.log('🤖 Using Gemini AI for analysis...');
      // Pass original form data to Gemini, not the transformed payload
      const dataForGemini = originalFormData || payload;
      const geminiResult = await analyzeWithGemini(dataForGemini);
      console.log('✅ Gemini analysis successful');
      return geminiResult;
    } catch (geminiError) {
      console.warn('⚠️ Gemini analysis failed, falling back to backend:', geminiError.message);
      // Fall through to backend API
    }
  } else if (!isGeminiConfigured()) {
    console.log('ℹ️ Gemini not configured, using backend API');
  }
  
  // Fall back to backend API
  try {
    const response = await fetch(`${API_BASE_URL}/api/triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform backend response to frontend format
    return transformBackendResponse(data);
  } catch (error) {
    console.error('Error calling triage API:', error);
    throw error;
  }
}

/**
 * Transform backend API response to frontend format
 */
function transformBackendResponse(backendData) {
  // Map triage_label to triage_level for frontend
  const triageLevelMap = {
    'EMERGENCY_911': 'EMERGENCY',
    'URGENT_CARE': 'URGENT',
    'SEE_DOCTOR_24H': 'ROUTINE',
    'SELF_CARE_MONITOR': 'SELF_CARE'
  };
  
  const triageLevel = triageLevelMap[backendData.triage_label] || 'ROUTINE';
  
  // Build suggested actions from backend data
  const suggestedActions = [];
  
  if (backendData.action) {
    suggestedActions.push(backendData.action);
  }
  
  if (backendData.timeframe) {
    suggestedActions.push(`Timeframe: ${backendData.timeframe}`);
  }
  
  // Add matched rules as additional context
  if (backendData.matched_rules && backendData.matched_rules.length > 0) {
    const ruleNames = backendData.matched_rules.map(rule => rule.name).join(', ');
    suggestedActions.push(`Based on: ${ruleNames}`);
  }
  
  return {
    triage_level: triageLevel,
    explanation: backendData.explanation || 'Please consult with a healthcare provider.',
    suggested_actions: suggestedActions,
    urgency: backendData.urgency,
    confidence_score: backendData.confidence_score,
    session_id: backendData.session_id
  };
}

/**
 * Build the triage payload from form data
 * Maps frontend format to backend API format
 */
export function buildTriagePayload(formData) {
  // Convert symptoms list to readable symptom names
  const symptomMap = {
    'fever': 'fever',
    'chest_pain': 'chest pain',
    'breathlessness': 'shortness of breath',
    'vomiting': 'vomiting',
    'drowsy': 'confusion',
    'runny_nose': 'runny nose'
  };
  
  // Build symptoms array from both text and checkboxes
  const symptoms = [];
  
  // Add symptoms from checkboxes
  if (formData.symptoms_list && formData.symptoms_list.length > 0) {
    formData.symptoms_list.forEach(symptomId => {
      if (symptomMap[symptomId]) {
        symptoms.push(symptomMap[symptomId]);
      }
    });
  }
  
  // Parse symptoms from text description
  if (formData.symptoms_text && formData.symptoms_text.trim()) {
    // Extract key symptom words from the text
    const text = formData.symptoms_text.toLowerCase();
    const symptomKeywords = [
      'chest pain', 'headache', 'fever', 'cough', 'shortness of breath',
      'difficulty breathing', 'dizziness', 'nausea', 'vomiting', 
      'abdominal pain', 'back pain', 'sore throat', 'fatigue',
      'sweating', 'confusion', 'runny nose', 'sneezing'
    ];
    
    symptomKeywords.forEach(keyword => {
      if (text.includes(keyword) && !symptoms.includes(keyword)) {
        symptoms.push(keyword);
      }
    });
  }
  
  // Ensure we have at least one symptom
  if (symptoms.length === 0 && formData.symptoms_text) {
    symptoms.push(formData.symptoms_text.trim());
  }
  
  return {
    symptoms: symptoms,
    severity: formData.severity || 'moderate',
    patient_age: formData.age ? parseInt(formData.age) : null,
    duration: null, // Could be extracted from symptoms_text if needed
    additional_factors: []
  };
}
