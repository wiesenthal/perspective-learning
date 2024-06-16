import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";

export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const models = {
  // opus: anthropic("claude-3-opus-20240229"),
  // sonnet: anthropic("claude-3-sonnet-20240229"),
  // haiku: anthropic("claude-3-haiku-20240307"),
  gpt4o: openai("gpt-4o"),
  llama: groq("llama3-8b-8192"),
};

export const DEFAULT_MODEL = (process.env.MODEL ??
  "gpt4o") as keyof typeof models;
