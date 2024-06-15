import { CoreMessage, StreamingTextResponse, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";

const models = {
  opus: anthropic("claude-3-opus-20240229"),
  sonnet: anthropic("claude-3-sonnet-20240229"),
  haiku: anthropic("claude-3-haiku-20240307"),
  gpt4o: openai("gpt-4o"),
};

export async function POST(req: Request) {
  const {
    messages,
    model,
  }: { messages: CoreMessage[]; model: keyof typeof models } = await req.json();

  const result = await streamText({
    model: models[model],
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}
