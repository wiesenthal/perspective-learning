import { CoreMessage, StreamingTextResponse, streamText } from "ai";
import { models, DEFAULT_MODEL } from "./models";

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
