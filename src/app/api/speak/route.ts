import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export async function POST(request: Request) {
  const { text, model } = await request.json();

  try {
    const filePath = await getAudio(text, model);
    return NextResponse.json({ audioUrl: filePath });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

const getAudio = async (text: string, model: string) => {
  const response = await deepgram.speak.request({ text }, { model });
  const stream = await response.getStream();

  const fileName = `audio${Date.now()}.wav`;

  if (stream) {
    const buffer = await getAudioBuffer(stream);

    try {
      // Ensure 'public/audio' directory exists
      const audioDirectory = path.join(
        process.env.NODE_ENV === "development" ? process.cwd() : "/tmp",
        "public",
        "audio"
      );
      if (!fs.existsSync(audioDirectory)) {
        fs.mkdirSync(audioDirectory, { recursive: true });
      }

      // Write audio file to 'public/audio' directory
      await new Promise((resolve, reject) => {
        fs.writeFile(path.join(audioDirectory, fileName), buffer, (err) => {
          if (err) {
            console.error("Error writing audio to file:", err);
            reject(err);
          } else {
            console.log(`Audio file written to ${fileName}`);
            resolve(undefined);
          }
        });
      });
    } catch (err) {
      throw err;
    }

    return `/api/audio/${fileName}`;
  } else {
    console.error("Error generating audio:", stream);
    throw new Error("Error generating audio: Stream is empty");
  }
};

// Helper function to convert stream to audio buffer
const getAudioBuffer = async (response: ReadableStream) => {
  const reader = response.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const dataArray = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    dataArray.set(chunk, offset);
    offset += chunk.length;
  }

  return Buffer.from(dataArray.buffer);
};
