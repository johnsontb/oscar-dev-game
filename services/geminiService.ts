import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';
import { CodeValidationResult, Level } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateCode = async (level: Level, userCode: string): Promise<CodeValidationResult> => {
  const prompt = `
    Level Title: ${level.title}
    Mission: ${level.mission}
    Concept to learn: ${level.concept}
    
    Oscar's Code:
    ${userCode}
    
    Did Oscar complete the mission? 
    Check if the code is valid HTML/CSS and fulfills the visual goal described in the mission.
    Ignore minor syntax errors if the browser would likely still render it, but point them out gently if they break the view.
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
      feedback: result.feedback ?? "I couldn't quite read that, Captain Oscar. Try again!"
    };
  } catch (error) {
    console.error("Gemini validation failed:", error);
    // Fallback to basic regex matching if API fails
    const basicCheck = new RegExp(level.solutionPattern, 'i').test(userCode);
    return {
      success: basicCheck,
      feedback: basicCheck 
        ? "Awesome work, Oscar! (Offline Mode)" 
        : "Hmm, something looks missing. Check your spelling! (Offline Mode)"
    };
  }
};

export const getHint = async (level: Level, userCode: string): Promise<string> => {
    try {
        const prompt = `
            Oscar is stuck on Level: ${level.title}.
            Mission: ${level.mission}
            His current code: ${userCode}
            
            Give him a tiny, easy hint. Use space metaphors.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: GEMINI_SYSTEM_INSTRUCTION
            }
        });
        return response.text || "Try looking at the examples again!";
    } catch (e) {
        return "Check your spelling carefully!";
    }
}