
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  // @ts-ignore
  const key = typeof process !== 'undefined' ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: key || '' });
};

export const generateStudioResponse = async (
  prompt: string, 
  onChunk: (text: string) => void,
) => {
  const ai = getAI();
  
  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `You are the Lead AI of "Knowledge Chat" (شات المعرفة).
        
        IDENTITY RULES:
        1. Your name is "Knowledge Chat Engine".
        2. You provide deep knowledge synthesis, code generation, and media production.
        3. Always maintain a professional, helpful tone in both Arabic and English.
        
        OUTPUT STRUCTURE:
        /filename.ext
        \`\`\`extension
        code
        \`\`\``,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    let fullText = '';
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error: any) {
    console.error("Knowledge Engine Error:", error.message);
    throw error;
  }
};

export const generateVideo = async (prompt: string) => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { resolution: '1080p', aspectRatio: '16:9', numberOfVideos: 1 }
    });

    while (!operation.done) {
      await new Promise(r => setTimeout(r, 8000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // @ts-ignore
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    const res = await fetch(`${downloadLink}&key=${apiKey}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video Core Error:", error);
    return null;
  }
};
