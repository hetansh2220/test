import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini/client";

export async function POST(req: NextRequest) {
  try {
    const { monthlyIncome, totalExpenses, profession, incomeType } = await req.json();

    const model = getGeminiModel();

    const prompt = `You are a financial coach for an Indian user.
Generate 3 personalized saving challenges based on this profile:
- Profession: ${profession}
- Income type: ${incomeType}
- Monthly income: ₹${monthlyIncome}
- Monthly expenses: ₹${totalExpenses}

Each challenge should have:
- title (short, motivating)
- description (1-2 sentences)
- targetAmount (realistic number in INR)
- frequency ("daily" or "weekly")
- perPeriodTarget (amount per day or week)
- durationDays (7, 14, 21, or 30)

Return ONLY valid JSON array, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const challenges = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ challenges });
    }

    return NextResponse.json({ challenges: [] });
  } catch (error: any) {
    console.error("Challenge suggestion error:", error);
    return NextResponse.json({ challenges: [] }, { status: 500 });
  }
}
