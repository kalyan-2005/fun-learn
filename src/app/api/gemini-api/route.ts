import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const googleGenerativeAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { topic, nQuestions, difficulty } = await req.json();

    const model = googleGenerativeAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `You are a helpful assistant designed to output JSON.You are to generate a random ${difficulty} mcq ${nQuestions} question about ${topic} and output format of each object is  {
      question: "question",
      options: ["option1 with max length of 15 words","option2 with max length of 15 words","precisely 4 options"],
      answer: "1 for 1st option or n for nth option which is correct ",
    } and you have to generate array of of objects consisting of ${nQuestions} questions on the topic ${topic} and questions should contain variable number of options like 1st queestion of 3 options 2nd of 5 options 3rd of 3 options e.t.c `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({ message: "Success", payload: response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Error" });
  }
}
