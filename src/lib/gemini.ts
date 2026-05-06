import { GoogleGenAI } from '@google/genai';

let ai: GoogleGenAI | null = null;

function getAIClient() {
  if (!ai) {
    // Check process.env.GEMINI_API_KEY (AI Studio) or import.meta.env.VITE_GEMINI_API_KEY
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY)
      || import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey && apiKey !== 'undefined' && apiKey !== 'null') {
      ai = new GoogleGenAI({ apiKey });
    }
  }
  return ai;
}

export async function convertImageToHtml(base64Image: string, mimeType: string): Promise<string> {
  const prompt = `
You are an expert web developer and document conversion specialist. 
Your task is to accurately transcribe the provided image of a document into clean HTML and Tailwind CSS.
Do not wrap your response in markdown fences (like \`\`\`html). Output ONLY the raw HTML string, ready to be injected into a React application using dangerouslySetInnerHTML.

Follow these strict guidelines:
1.  **Exact Layout & Alignment**: You MUST perfectly replicate the layout, alignment, and spacing. Use Tailwind CSS grid or flexbox where possible (\`grid\`, \`flex\`, \`justify-between\`, etc.). If Tailwind is not precise enough, you MUST use inline CSS styles for exact positioning, margins, or padding. Do NOT leave things misaligned.
2.  **Colors & Boxes**: For text and background colors, you MUST precisely match the colors in the image. If standard Tailwind colors aren't exact, you MUST use inline styles with exact hex codes (e.g., \`style="color: #354a5f; background-color: #f1f5f9;"\`). Meticulously recreate all borders, boxes, shaded backgrounds and table lines. Pay special attention to gradient backgrounds or distinct colored sections.
3.  **Language & RTL**: If the document is in a Right-to-Left language like Arabic or Hebrew, you MUST add \`dir="rtl"\` to the outermost container and ensure text alignment reflects this.
4.  **Typography & Fonts**: We have explicitly defined three common fonts that look great and are available everywhere. You MUST use one of these explicitly:
     - \`font-sans\` for standard sans-serif text (Arial, Helvetica style)
     - \`font-serif\` for serif text (Times New Roman, formal documents)
     - \`font-mono\` for monospace text (Courier, typewriter style)
5.  **Tables**: Carefully recreate tables and boxed sections. Ensure precise alignments within cells. Add correct borders. Avoid adding extra padding if the original table doesn't have it.
6.  **No Extraneous Content**: Do NOT include <html>, <head>, or <body> tags. The output should just be a high-level wrapper <div> containing the document reconstruction. Do not include any intro or conversational text.
7.  **Formatting**: Transcribe all the text exactly. Do not summarize or skip anything.
`;

  try {
    // Strip the "data:image/...;base64," part if it exists
    const base64Data = base64Image.split(',')[1] || base64Image;

    const client = getAIClient();
    
    if (!client) {
      // Return a simulated mock response if no API key is available
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: black; max-width: 100%; margin: 0 auto; box-sizing: border-box; border: 1px dashed #ccc; padding: 40px; background: white; text-align: center;">
        <h1 style="color: #2563eb; font-size: 1.8rem; font-weight: bold; margin-bottom: 20px;">Image Processing Simulator</h1>
        <p style="font-size: 1.1rem; color: #4b5563; margin-bottom: 20px; line-height: 1.5;">
          No Gemini API Key was found in the environment variables. 
          <br/><br/>
          In a production environment with an API Key, the AI would transcribe the following image into perfect HTML/CSS. For now, you are seeing this mock placeholder so you can test the layout and printing.
        </p>
        <div style="display: inline-block; padding: 4px; border: 2px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
          <img src="${base64Image}" style="max-width: 100%; max-height: 400px; display: block;" alt="Uploaded preview" />
        </div>
      </div>`;
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    let html = response.text || '';
    
    // Safety fallback: in case the model wraps it in markdown despite instructions
    if (html.startsWith('\`\`\`html')) {
        html = html.substring(7);
        if (html.endsWith('\`\`\`')) {
            html = html.substring(0, html.length - 3);
        }
    } else if (html.startsWith('\`\`\`')) {
        html = html.substring(3);
        if (html.endsWith('\`\`\`')) {
            html = html.substring(0, html.length - 3);
        }
    }

    return html.trim();

  } catch (error) {
    console.error("Error connecting to Gemini API:", error);
    throw new Error("Failed to convert image to document. Please check your API key and try again.");
  }
}
