import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';
import { CodeValidationResult, Level } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateCode = async (level: Level, userCode: string): Promise<CodeValidationResult> => {
  const prompt = `
    Task: Check code for a 7-year-old boy named Oscar.
    Level: ${level.title}
    Goal Code (or similar): ${level.guideSnippet || "HTML structure matching the mission"}
    
    Oscar's Code:
    ${userCode}
    
    Did he strictly or loosely match the goal?
    If he is close but missing a bracket or quote, be gentle.
    Respond in JSON with 'success' (boolean) and 'feedback' (string, max 10 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["success", "feedback"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      success: result.success ?? false,
      feedback: result.feedback ?? "I couldn't read that. Try again!"
    };
  } catch (error) {
    console.error("Gemini validation failed:", error);
    // Fallback to basic regex matching if API fails
    const basicCheck = new RegExp(level.solutionPattern, 'i').test(userCode);
    return {
      success: basicCheck,
      feedback: basicCheck 
        ? "Good job, Oscar!" 
        : "Check your spelling!"
    };
  }
};

export const getHint = async (level: Level, userCode: string): Promise<string> => {
    try {
        const prompt = `
            Oscar (age 7) is stuck on Level: ${level.title}.
            The answer is: ${level.guideSnippet}
            His code: ${userCode}
            
            Give a 5-word hint.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: GEMINI_SYSTEM_INSTRUCTION
            }
        });
        return response.text || "Look at the blue box above!";
    } catch (e) {
        return "Look at the example code!";
    }
}