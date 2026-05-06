import { GoogleGenAI } from '@google/genai';

// Initialize the API client
// The API key is securely injected by AI Studio at runtime
// via Vite's define configuration.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const response = await ai.models.generateContent({
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
