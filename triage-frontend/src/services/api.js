// API configuration - Change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Call the triage API endpoint
 * @param {Object} payload - The triage request payload
 * @returns {Promise<Object>} - The triage response
 */
export async function callTriageAPI(payload) {
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
    return data;
  } catch (error) {
    console.error('Error calling triage API:', error);
    throw error;
  }
}

/**
 * Build the triage payload from form data
 */
export function buildTriagePayload(formData) {
  return {
    symptoms_text: formData.symptoms_text,
    symptoms_list: formData.symptoms_list,
    age: formData.age,
    is_child: formData.is_child,
    severity: formData.severity,
  };
}
