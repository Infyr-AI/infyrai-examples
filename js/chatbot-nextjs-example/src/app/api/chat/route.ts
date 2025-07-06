// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.INFYRAI_API_KEY,
  baseURL: process.env.INFYRAI_BASE_URL || "https://api.infyr.ai/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "lumo-8b",
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    return NextResponse.json(completion);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}
