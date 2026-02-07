import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini/client";

export async function POST(req: NextRequest) {
  try {
    const { message, financialContext } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: "Please send a message." }, { status: 400 });
    }

    const model = getGeminiModel();

    const systemPrompt = `You are FinWell AI, a friendly and encouraging financial wellbeing assistant for an Indian user.
You help them understand their finances and build better money habits.
Keep responses concise (2-4 paragraphs max), encouraging, and actionable.
Use INR (₹) for currency. Avoid complex financial jargon.
Be warm and supportive, like a knowledgeable friend.

User's current financial summary:
- Monthly income: ₹${financialContext.monthlyIncome}
- This month's expenses: ₹${financialContext.totalExpenses}
- Budget limit: ₹${financialContext.budgetLimit}
- Savings this month: ₹${financialContext.totalSavings}
- Financial health score: ${financialContext.healthScore}/100
- Upcoming bills: ${financialContext.upcomingBills}
- Active saving challenges: ${financialContext.activeChallenges}`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "I understand. I'm FinWell AI, ready to help with personalized, friendly financial guidance based on your current financial situation." }] },
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini API error:", error);

    const msg = error?.message || "";
    let reply = "I'm having trouble connecting. Please try again later.";

    if (msg.includes("quota") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
      reply = "The AI assistant has reached its daily usage limit (free tier). Please wait a while and try again, or upgrade to a paid Gemini API plan.";
    } else if (!process.env.GEMINI_API_KEY) {
      reply = "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.";
    } else if (msg.includes("API_KEY_INVALID") || msg.includes("400")) {
      reply = "The Gemini API key appears to be invalid. Please check your GEMINI_API_KEY in .env.local.";
    }

    return NextResponse.json({ reply }, { status: 500 });
  }
}
