import { CoreMessage, generateText } from "ai";
import { models, DEFAULT_MODEL } from "../generate/models";

export async function POST(req: Request) {
  let {
    messages,
    model,
  }: { messages: CoreMessage[]; model?: keyof typeof models } =
    await req.json();

  if (!model) {
    model = DEFAULT_MODEL;
  }

  const result = await generateText({
    model: models[model],
    messages,
  });

  return new Response(result.text);
}
