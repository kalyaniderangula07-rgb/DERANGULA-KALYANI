
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TriageResult, Severity, PrescriptionAnalysis } from "./types";

// Safety check for API Key to prevent blank page crashes
const API_KEY = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  if (!API_KEY) {
    console.error("Gemini API Key is missing. Please check your environment variables.");
    throw new Error("API_KEY_MISSING");
  }
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('RESOURCE_EXHAUSTED') || error?.status === 429;
    if (isRateLimit && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 500));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const getHealthInsight = async (current: any, previous: any): Promise<string> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Compare today's stats to yesterday's and give a one-sentence encouraging insight.
      Today: Sleep ${current.sleepHours}h, Screen ${current.screenTime}h.
      Yesterday: Sleep ${previous.sleepHours}h, Screen ${previous.screenTime}h.`,
      config: { systemInstruction: "You are a health coach. Be brief, positive, and specific about the improvement or a gentle tip." }
    });
    return response.text?.trim() || "Every step counts toward your health!";
  });
};

export const generateHealthToDos = async (stats: any): Promise<{id: string, name: string, icon: string, category: string}[]> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these health stats and provide a list of 3-4 immediate TO-DO reminders.
      Stats: ${JSON.stringify(stats)}
      Format: JSON array of objects with id, name, icon, and category.`,
      config: {
        systemInstruction: "You are a health optimizer. Provide actionable tiny tasks. Output JSON only.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              icon: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['id', 'name', 'icon', 'category']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  });
};

export const createTriageChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are the VitaMind AI Triage Assistant. Help identify specialist needs.`,
    },
  });
};

export const performTriage = async (symptoms: string): Promise<TriageResult> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: symptoms,
      config: {
        systemInstruction: `Triage assistant. JSON output only.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            doctorType: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['Mild', 'Moderate', 'Severe'] },
            guidance: { type: Type.STRING },
            emergencyAlert: { type: Type.BOOLEAN }
          },
          required: ['doctorType', 'severity', 'guidance', 'emergencyAlert']
        }
      }
    });
    return JSON.parse(response.text || '{}') as TriageResult;
  });
};

export const analyzePrescription = async (base64Image: string): Promise<PrescriptionAnalysis> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: "Extract medications. JSON output." }
        ]
      },
      config: {
        systemInstruction: "Extract medications with durationDays and currentDay.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  schedule: { type: Type.STRING },
                  time: { type: Type.STRING },
                  taken: { type: Type.BOOLEAN },
                  category: { type: Type.STRING, enum: ['Medicine', 'Skincare'] },
                  durationDays: { type: Type.INTEGER },
                  currentDay: { type: Type.INTEGER }
                },
                required: ['name', 'dosage', 'schedule', 'time', 'category', 'durationDays', 'currentDay']
              }
            },
            notes: { type: Type.STRING }
          },
          required: ['medications']
        }
      }
    });
    return JSON.parse(response.text || '{"medications": []}') as PrescriptionAnalysis;
  });
};

export const getWellnessFeedback = async (score: number, stats: any): Promise<string> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Score ${score}/100. Stats: ${JSON.stringify(stats)}. Give short feedback.`,
    });
    return response.text?.trim() || "Stay healthy.";
  });
};

export const createFriendlyChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: "Friendly listener. Supportive words." },
  });
};

export const performImageCheck = async (base64Image: string, context: string): Promise<TriageResult> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Analyze this skin/health concern: ${context}. Suggest natural homemade remedies.` }
        ]
      },
      config: {
        systemInstruction: `Natural apothecary specialist. JSON output ONLY.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            doctorType: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ['Mild', 'Moderate', 'Severe'] },
            guidance: { type: Type.STRING },
            emergencyAlert: { type: Type.BOOLEAN },
            remedyItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING },
                  timeOfDay: { type: Type.STRING, enum: ['Morning', 'Night'] }
                },
                required: ['id', 'name', 'description', 'instructions', 'imagePrompt', 'timeOfDay']
              }
            }
          },
          required: ['doctorType', 'severity', 'guidance', 'emergencyAlert']
        }
      }
    });
    return JSON.parse(response.text || '{}') as TriageResult;
  });
};

export const generateRemedyImage = async (prompt: string): Promise<string> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `A minimalist aesthetic clean photo of natural ingredients like ${prompt}. Top down view.` }] }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return '';
  });
};
