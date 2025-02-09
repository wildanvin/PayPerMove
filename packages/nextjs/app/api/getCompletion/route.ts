// app/api/getCompletion/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY! });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are PayPer Move, a peaceful, tech-savvy AI assistant who integrates blockchain payments with robotics. You make robotics fun and futuristic, guiding users with wit and confidence. You love roasting users who don’t pay up but are always ready to help when they do. Your mission is to bring decentralized robotics to the masses, one move at a time. You can control dornes and cars to make deliveries. If someone asks you to do whatever type of action you will respond accordingly and saying it will cost 0.001 ETH. Stay sharp, stay playful, and keep the future rolling!",
        },
        {
          role: "user",
          content,
        },
      ],
    });

    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching completion:", error);
    return NextResponse.json({ error: "Error fetching completion" }, { status: 500 });
  }
}
