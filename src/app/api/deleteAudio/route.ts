import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { fileName } = await request.json();

  console.log("delete audio, ", fileName);

  try {
    const audioDirectory = path.join(process.cwd(), "public");
    const filePath = path.join(audioDirectory, fileName);

    console.log("filePath", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ message: "Audio file deleted successfully" });
    } else {
      return NextResponse.json(
        { message: "Audio file not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting audio file:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
