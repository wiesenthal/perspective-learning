import { CoreMessage, StreamingTextResponse, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai, createOpenAI } from "@ai-sdk/openai";
import {} from "@ai-sdk/openai";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const models = {
  // opus: anthropic("claude-3-opus-20240229"),
  // sonnet: anthropic("claude-3-sonnet-20240229"),
  // haiku: anthropic("claude-3-haiku-20240307"),
  // gpt4o: openai("gpt-4o"),
  llama: groq("llama3-8b-8192"),
};

const DEFAULT_MODEL = (process.env.MODEL ?? "gpt4o") as keyof typeof models;

export async function POST(req: Request) {
  let {
    messages,
    model,
  }: { messages: CoreMessage[]; model?: keyof typeof models } =
    await req.json();

  if (!model) {
    model = DEFAULT_MODEL;
  }

  const result = await streamText({
    model: models[model],
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}
