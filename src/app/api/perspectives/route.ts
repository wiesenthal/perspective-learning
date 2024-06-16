import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Message } from "ai";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const perspectives = await prisma.perspective.findMany({
    include: {
      messages: true,
    },
  });

  return NextResponse.json(perspectives);
}
