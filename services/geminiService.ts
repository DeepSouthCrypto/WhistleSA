
import { GoogleGenAI, Type } from "@google/genai";
import { CorruptionCategory } from "../types";

export const geminiService = {
  analyzeReport: async (description: string) => {
    try {
      // Instantiate the AI client inside the function to ensure process.env.API_KEY is available 
      // and to avoid module-level 'Illegal constructor' issues in certain ESM environments.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this corruption report and categorize it. 
        Report: "${description}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                description: "The primary type of corruption reported.",
                enum: Object.values(CorruptionCategory)
              },
              agency: {
                type: Type.STRING,
                description: "The South African law enforcement agency best suited for this.",
                enum: ["SIU", "HAWKS"]
              },
              priority: {
                type: Type.STRING,
                enum: ["Low", "Medium", "High", "Critical"]
              },
              summary: {
                type: Type.STRING,
                description: "A 2-sentence anonymized summary for public tracking."
              }
            },
            required: ["category", "agency", "priority", "summary"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("AI Analysis failed:", error);
      return {
        category: CorruptionCategory.OTHER,
        agency: "PENDING",
        priority: "Medium",
        summary: "Case pending manual review."
      };
    }
  }
};
