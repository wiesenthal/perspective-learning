import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Message } from "ai";

export async function POST(request: NextRequest) {
  const { id, title, messages } = await request.json();

  const existingPerspective = await prisma.perspective.findUnique({
    where: {
      id,
    },
    include: {
      messages: true,
    },
  });

  if (!existingPerspective) {
    const perspective = await prisma.perspective.create({
      data: {
        id,
        name: title,
        messages: {
          create: messages.map((message: Message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
        },
      },
    });
    return NextResponse.json(perspective);
  }

  const perspective = await prisma.perspective.update({
    where: {
      id,
    },
    data: {
      name: title,
      messages: {
        create: messages
          .filter(
            (message: Message) =>
              !existingPerspective.messages.some(
                (existingMessage) => existingMessage.id === message.id
              )
          )
          .map((message: Message) => ({
            id: message.id,
            role: message.role,
            content: message.content,
          })),
      },
    },
  });

  return NextResponse.json(perspective);
}
