import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt, systemInstruction, responseSchema } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server. Please check your .env.local file." },
        { status: 500 }
      );
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    interface GeminiRequestBody {
      contents: { parts: { text: string }[] }[];
      generationConfig: {
        responseMimeType: string;
        responseSchema?: unknown;
      };
      systemInstruction?: {
        parts: { text: string }[];
      };
    }

    const requestBody: GeminiRequestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    if (systemInstruction) {
      requestBody.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    if (responseSchema) {
      requestBody.generationConfig.responseSchema = responseSchema;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Gemini API reported error: ${errText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return NextResponse.json(
        { error: "Gemini did not return any content. Check your prompt or configuration." },
        { status: 500 }
      );
    }

    // Return the JSON parsed output directly
    return NextResponse.json(JSON.parse(textOutput));
  } catch (error) {
    console.error("Gemini API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
