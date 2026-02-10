
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { TriageResult, Severity, PrescriptionAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
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
      If water is low, suggest hydration. If sleep is low, suggest rest or inner peace. If screen time is high, suggest digital peace.
      Format: JSON array of objects with id, name, icon, and category.`,
      config: {
        systemInstruction: "You are a health optimizer. Provide actionable tiny tasks based on stats. Focus on categories like 'Hydration', 'Movement', 'Digital Peace', 'Inner Peace'. Output JSON only.",
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
      systemInstruction: `You are the Whenever AI Triage Assistant. 
      Goal: Chat with the user about their health concern, ask 1-2 clarifying questions, and then provide guidance on which doctor to see.
      Rules:
      1. DO NOT diagnose. Use phrases like "It sounds like you might benefit from seeing a..."
      2. If symptoms are severe (chest pain, stroke signs), immediately tell them to call emergency services.
      3. Keep the conversation friendly but professional.
      4. Summarize your advice and suggest a specialist.`,
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

export const getStorytellerMessage = async (taken: number, total: number): Promise<string> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User done ${taken}/${total} tasks. One sentence message.`,
    });
    return response.text?.trim() || "Keep going!";
  });
};

export const getWellnessFeedback = async (score: number, stats: any): Promise<string> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Score ${score}/100. Stats: ${JSON.stringify(stats)}.`,
    });
    return response.text?.trim() || "Stay healthy.";
  });
};

export const createFriendlyChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction: "Friendly listener. Tiny words. Validation only." },
  });
};

export const performImageCheck = async (base64Image: string, context: string): Promise<TriageResult> => {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Analyze this skin/health concern: ${context}. 
          IMPORTANT: Suggest ONLY natural, homemade remedies found in a standard kitchen (e.g., Turmeric paste, Honey, Aloe, Neem, etc.). 
          DO NOT suggest pharmaceutical or store-bought clinical products.` }
        ]
      },
      config: {
        systemInstruction: `You are a specialist in natural dermatology and home apothecary.
        Your goal is to analyze the user's skin photo and provide:
        1. A clinical specialist recommendation (e.g., Dermatologist) if needed.
        2. A list of 2-3 strictly HOMEMADE, NATURAL remedies (kitchen-based ingredients like honey, turmeric, coconut oil).
        The remedies should include clear preparation instructions.
        JSON output ONLY.`,
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
