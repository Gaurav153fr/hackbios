// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { streamText, StreamingTextResponse } from "ai";

// export const runtime = "edge";

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//   const response = await streamText({
//     model: genAI.getGenerativeModel({ model: "gemini-2.0-flash" }), // change model here
//     messages,
//   });

//   return new StreamingTextResponse(response);
// }
