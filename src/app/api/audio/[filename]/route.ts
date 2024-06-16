import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join("/tmp", "public", "audio", filename);

  try {
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error serving audio file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
