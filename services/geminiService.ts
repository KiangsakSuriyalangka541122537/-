import { GoogleGenAI, Type } from "@google/genai";

export const generateThaiResidents = async (count: number): Promise<string[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning mock data.");
    return [
      "สมชาย ใจดี", "สมหญิง รักเรียน", "วิชัย กล้าหาญ", "สุดา งามตา", "ประวิทย์ มั่นคง"
    ];
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of ${count} realistic Thai full names (Firstname Lastname) suitable for government officials. Do not include titles like Mr. or Mrs.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of Thai names",
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    return parsed.names || [];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};