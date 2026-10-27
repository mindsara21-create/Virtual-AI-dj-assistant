import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model,
      contents: "Say hello as a friendly AI DJ in one short sentence.",
    });
    return NextResponse.json({ ok: true, model, text: response.text });
  } catch (error) {
    return NextResponse.json({ ok: false, model, error: String(error) }, { status: 500 });
  }
}
