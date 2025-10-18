import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMoodboard = async (prompt: string) => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `A high-quality mood board about: ${prompt}. Ensure the images are aesthetically pleasing and cohesive.`,
    config: {
      numberOfImages: 4,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });

  // FIX: Changed MIME type from image/png to image/jpeg to match the API response.
  return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
};

export const generateRoomPlan = async (prompt: string, options?: { width?: number; height?: number }) => {
    let dimensionPrompt = '';
    if (options?.width && options?.height) {
        dimensionPrompt = ` for a room that is ${options.width} feet wide and ${options.height} feet long`;
    }

    const fullPrompt = `Generate a 2D top-down room plan as a valid SVG string${dimensionPrompt}. The SVG should be simple, with black lines for walls and basic shapes for furniture. The background should be transparent. Do not include any text or comments outside of the SVG tags.
    Description: "${prompt}"
    Example of a valid response: <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="400" height="300" fill="none" stroke="black" stroke-width="2" /><rect x="50" y="50" width="100" height="80" fill="none" stroke="black" stroke-width="1" /><circle cx="250" cy="150" r="30" fill="none" stroke="black" stroke-width="1" /></svg>`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: fullPrompt,
    });
    
    let svgContent = response.text.trim();

    // Clean up potential markdown code block fences
    if (svgContent.startsWith('```svg')) {
      svgContent = svgContent.substring(5);
    }
    if (svgContent.startsWith('```')) {
        svgContent = svgContent.substring(3);
    }
    if (svgContent.endsWith('```')) {
        svgContent = svgContent.slice(0, -3);
    }
    
    return svgContent;
};

export const suggestProducts = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Suggest 3 fictional products based on the following theme, including a name, short description, and price. Theme: ${prompt}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.STRING },
          },
          required: ['name', 'description', 'price'],
        },
      },
    },
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr);
};

export const createInvoice = async (prompt: string) => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create an invoice from the following description. Calculate totals. Description: ${prompt}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                description: { type: Type.STRING },
                                quantity: { type: Type.NUMBER },
                                unitPrice: { type: Type.NUMBER },
                                total: { type: Type.NUMBER },
                            },
                             required: ['description', 'quantity', 'unitPrice', 'total'],
                        }
                    },
                    subtotal: { type: Type.NUMBER },
                    tax: { type: Type.NUMBER },
                    total: { type: Type.NUMBER },
                },
                required: ['items', 'subtotal', 'tax', 'total'],
            },
        },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
};


export const generateLook = async (prompt: string) => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `A full-body photograph of a fashion look based on this theme: ${prompt}. The person should be on a plain, neutral background.`,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '9:16',
    },
  });

  // FIX: Changed MIME type from image/png to image/jpeg to match the API response.
  return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
};

export const generateColorPalette = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a color palette with 5 complementary hex codes based on the theme: "${prompt}"`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "A hex color code, e.g., '#RRGGBB'",
        },
      },
    },
  });

  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr);
};