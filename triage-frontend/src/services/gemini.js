import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Check if API key is loaded (don't log the actual key!)
console.log('🔑 Gemini API Key status:', API_KEY ? 'Loaded ✅' : 'Missing ❌');
if (API_KEY) {
  console.log('🔑 API Key length:', API_KEY.length, 'characters');
  console.log('🔑 API Key starts with:', API_KEY.substring(0, 10) + '...');
}

// Initialize Gemini AI
let genAI = null;
let model = null;

if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Using Gemini 2.0 Flash Experimental with system instructions for medical context
    model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      systemInstruction: `CORE IDENTITY AND GOAL:
You are an AI Healthcare Triage Assistant. Your primary goal is to provide preliminary guidance based on user-reported symptoms. You are NOT a doctor. Your task is to help users understand possibilities and make an informed decision about their next steps.

MANDATORY SAFETY DISCLAIMER:
Always begin EVERY single response with the following disclaimer. This is NON-NEGOTIABLE:

"IMPORTANT: I am an AI assistant, not a medical professional. This information is for preliminary guidance only and is not a substitute for a professional medical diagnosis or treatment. Please consult a qualified healthcare provider for any health concerns."

RESPONSE FORMAT RULES:
- Write in clear, plain text without markdown formatting
- Do NOT use asterisks (**), underscores (_), or other markdown symbols for bold/italic
- Use simple line breaks and spacing for structure
- Use plain dashes (-) for bullet points, not special symbols (•, ●, ○)
- Avoid emojis except for the warning symbol (⚠️) when absolutely necessary

RESPONSE STRUCTURE:
After the disclaimer, you MUST structure your response into these specific sections:

1. TRIAGE_LEVEL: [EMERGENCY/URGENT/ROUTINE/SELF_CARE]

2. PRIMARY_CONCERN: [Brief description of the main symptom/issue]

3. EXPLANATION: 
   - List potential conditions related to the symptoms provided
   - CRUCIALLY, do NOT provide a definitive diagnosis
   - Use cautious and non-committal language like:
     * "The symptoms you described could be related to..."
     * "Some common conditions that cause these symptoms include..."
     * "This might suggest..."

4. SUGGESTED_ACTIONS:
   Based on the potential severity, provide ONE of these clear recommendations:
   - Home Remedy: For minor, non-threatening symptoms (e.g., common cold)
   - Doctor Visit: For persistent, concerning, but not immediately life-threatening symptoms
   - Emergency Care: For symptoms indicating serious or life-threatening conditions

5. WARNING_SIGNS:
   List specific symptoms that would require immediate medical attention

6. SELF_CARE_TIPS: [If applicable for minor conditions]

EMERGENCY PROTOCOL 🚨:
If a user describes symptoms suggesting a medical emergency (chest pain, difficulty breathing, severe bleeding, signs of stroke, sudden severe headache, loss of consciousness):
- Ignore the standard structure
- Your ONLY response should immediately and clearly advise seeking emergency help:
  "Based on your symptoms, please seek emergency medical attention immediately. Contact your local emergency services or go to the nearest emergency room now."
- Set TRIAGE_LEVEL to EMERGENCY

TONE AND STYLE:
- Be calm, empathetic, and reassuring, but also direct and clear
- Avoid complex medical jargon
- Use simple language that patients can understand
- Always prioritize patient safety and err on the side of caution

PROHIBITED ACTIONS - DO NOT:
- Prescribe or suggest any specific medications, dosages, or treatments
- Ask for Personally Identifiable Information (PII) like name, age, or location
- Interpret medical images, lab results, or other diagnostic reports
- Engage in conversation outside the scope of symptom triage
- Use markdown formatting symbols in your response

Remember: Write everything in plain, readable text without any formatting symbols. Your role is preliminary guidance, not diagnosis.`
    });
    console.log('✅ Gemini AI model initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
  }
} else {
  console.warn('⚠️ VITE_GEMINI_API_KEY not found in environment variables');
}

/**
 * Analyze symptoms using Gemini Flash 2.5
 * @param {Object} symptomsData - The symptoms data from the form
 * @returns {Promise<Object>} - AI diagnosis and recommendations
 */
export async function analyzeWithGemini(symptomsData) {
  if (!API_KEY || !model) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  try {
    // Debug: Log the raw data received
    console.log('🔥 RAW DATA RECEIVED:', JSON.stringify(symptomsData, null, 2));
    
    // Build a detailed prompt for medical triage
    const prompt = buildMedicalTriagePrompt(symptomsData);
    
    console.log('🤖 Sending request to Gemini AI...');
    console.log('📤 FULL PROMPT BEING SENT:', prompt);
    
    // Generate content with optimized parameters
    // Note: Pass prompt as string directly, not in contents object
    const result = await model.generateContent(prompt, {
      generationConfig: {
        temperature: 0.3,  // Lower temperature for more consistent medical advice
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,  // Sufficient for detailed medical responses
      },
    });
    
    console.log('✅ Received response from Gemini AI');
    
    const response = await result.response;
    const text = response.text();
    
    console.log('📝 Parsing AI response...');
    
    // Parse the AI response into structured format
    return parseGeminiResponse(text, symptomsData);
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('Error details:', error.message);
    if (error.message.includes('API key')) {
      throw new Error('Gemini API key is invalid or not configured. Please check your .env file');
    }
    throw new Error(`Failed to get AI diagnosis: ${error.message}`);
  }
}

/**
 * Build a comprehensive medical triage prompt
 */
function buildMedicalTriagePrompt(symptomsData) {
  const { symptoms_text, symptoms_list, age, is_child, severity } = symptomsData;
  
  // Debug: Log what we received
  console.log('🔍 Building prompt with data:', {
    symptoms_text,
    symptoms_list,
    age,
    is_child,
    severity
  });
  
  // Convert symptom list to readable format with proper formatting
  const selectedSymptoms = symptoms_list && symptoms_list.length > 0 
    ? symptoms_list
        .map(s => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) // Convert 'chest_pain' to 'Chest Pain'
        .join(', ')
    : 'none selected';
  
  console.log('📋 Formatted symptoms:', selectedSymptoms);
  
  const prompt = `You are an AI medical triage assistant. Analyze the following patient information and provide a preliminary diagnosis and care recommendations.

PATIENT INFORMATION:
- Age: ${age || 'Not specified'} ${is_child ? '(Child/Minor)' : '(Adult)'}
- Severity Level: ${severity ? severity.toUpperCase() : 'Not specified'}
- Selected Symptoms: ${selectedSymptoms}
- Patient Description: ${symptoms_text || 'No description provided'}

YOUR TASK:
Analyze these symptoms carefully and provide a structured response with the following sections:

1. TRIAGE_LEVEL: Classify as one of these:
   - EMERGENCY (life-threatening, seek immediate emergency care)
   - URGENT (needs care within 2-4 hours)
   - ROUTINE (see doctor within 24-48 hours)
   - SELF_CARE (can manage at home with monitoring)

2. PRIMARY_CONCERN: Identify the main medical concern based on the symptoms

3. EXPLANATION: 
   - Start with the mandatory safety disclaimer
   - List possible health conditions related to these specific symptoms
   - Use non-committal language ("could be related to...", "might suggest...")
   - Be specific about the selected symptoms: ${selectedSymptoms}

4. SUGGESTED_ACTIONS: Based on severity, recommend one of:
   - Home Remedy (for minor symptoms)
   - Doctor Visit (for persistent but not life-threatening)
   - Emergency Care (for serious symptoms)

5. WARNING_SIGNS: List specific symptoms requiring immediate medical attention

6. SELF_CARE_TIPS: If applicable, provide home care advice (or N/A if urgent/emergency)

CRITICAL REMINDERS:
${is_child ? '- This is a CHILD/MINOR - be extra cautious with recommendations' : '- Consider age-appropriate care recommendations'}
${severity === 'severe' ? '- Patient reports SEVERE symptoms - prioritize urgent care' : ''}
- Focus your analysis on these specific symptoms: ${selectedSymptoms}
- Reference the patient's description: "${symptoms_text || 'No additional details'}"
- Write in plain text without markdown symbols

Provide your response now:`;

  return prompt;
}

/**
 * Parse Gemini's text response into structured format
 */
function parseGeminiResponse(text, originalData) {
  // Extract triage level
  const triageLevelMatch = text.match(/TRIAGE[_\s]LEVEL:?\s*(EMERGENCY|URGENT|ROUTINE|SELF_CARE)/i);
  const triageLevel = triageLevelMatch ? triageLevelMatch[1].toUpperCase() : 'ROUTINE';
  
  // Extract primary concern
  const concernMatch = text.match(/PRIMARY[_\s]CONCERN:?\s*([^\n]+)/i);
  const primaryConcern = concernMatch ? concernMatch[1].trim() : '';
  
  // Extract explanation
  const explanationMatch = text.match(/EXPLANATION:?\s*([\s\S]*?)(?=SUGGESTED[_\s]ACTIONS|WARNING[_\s]SIGNS|SELF[_\s]CARE|$)/i);
  let explanation = explanationMatch ? explanationMatch[1].trim() : '';
  
  // If explanation is too short, try to get more context
  if (explanation.length < 50 && text.length > 100) {
    // Use the full text if structured extraction fails
    explanation = text.slice(0, 500);
  }
  
  // Extract suggested actions (bullet points)
  const actionsMatch = text.match(/SUGGESTED[_\s]ACTIONS:?\s*([\s\S]*?)(?=WARNING[_\s]SIGNS|SELF[_\s]CARE|$)/i);
  const actionsText = actionsMatch ? actionsMatch[1] : '';
  const suggestedActions = extractBulletPoints(actionsText);
  
  // Extract warning signs
  const warningMatch = text.match(/WARNING[_\s]SIGNS:?\s*([\s\S]*?)(?=SELF[_\s]CARE|$)/i);
  const warningText = warningMatch ? warningMatch[1] : '';
  const warningSigns = extractBulletPoints(warningText);
  
  // Extract self-care tips
  const selfCareMatch = text.match(/SELF[_\s]CARE[_\s]TIPS:?\s*([\s\S]*?)$/i);
  const selfCareText = selfCareMatch ? selfCareMatch[1] : '';
  const selfCareTips = extractBulletPoints(selfCareText);
  
  // Build enhanced explanation
  let fullExplanation = '';
  if (primaryConcern) {
    fullExplanation += `Primary Concern: ${primaryConcern}\n\n`;
  }
  fullExplanation += explanation;
  
  if (warningSigns.length > 0) {
    fullExplanation += `\n\n⚠️ Warning Signs - Seek Immediate Care If:\n${warningSigns.map(s => `- ${s}`).join('\n')}`;
  }
  
  // Combine all actions
  const allActions = [...suggestedActions];
  if (selfCareTips.length > 0 && !selfCareTips[0].toLowerCase().includes('n/a')) {
    allActions.push('Self-Care Tips:');
    allActions.push(...selfCareTips.map(tip => `  ${tip}`));
  }
  
  return {
    triage_level: triageLevel,
    explanation: fullExplanation || 'AI analysis completed. Please review the recommendations below.',
    suggested_actions: allActions.length > 0 ? allActions : [
      'Consult with a healthcare professional',
      'Monitor your symptoms',
      'Stay hydrated and rest'
    ],
    ai_powered: true,
    raw_response: text, // Keep full response for debugging
    confidence_score: 0.85 // Gemini provides high-quality responses
  };
}

/**
 * Extract bullet points from text
 */
function extractBulletPoints(text) {
  if (!text) return [];
  
  // Split by lines and find bullet points
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const bullets = [];
  for (const line of lines) {
    // Match common bullet formats: -, *, •, 1., etc.
    const match = line.match(/^[-*•●○\d.)\]]\s*(.+)$/);
    if (match) {
      bullets.push(match[1].trim());
    } else if (line.length > 10 && !line.match(/^(WARNING|SELF|SUGGESTED|PRIMARY|EXPLANATION)/i)) {
      // Include non-bullet lines if they're substantive
      bullets.push(line);
    }
  }
  
  return bullets.slice(0, 7); // Limit to 7 items for better UX
}

/**
 * Check if Gemini is configured
 */
export function isGeminiConfigured() {
  return !!(API_KEY && model);
}

/**
 * Get a quick health tip using Gemini (optional feature)
 */
export async function getHealthTip(symptomType) {
  if (!API_KEY || !model) {
    return null;
  }

  try {
    const prompt = `Provide one brief, practical health tip (1-2 sentences) for someone experiencing ${symptomType}. Be encouraging and helpful.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Failed to get health tip:', error);
    return null;
  }
}
