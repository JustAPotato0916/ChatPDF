import { NextResponse } from 'next/server';
import { db } from "@/lib/db"
import { messages } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export const POST = async (req: Request) => {
    const body = await req.json()
    const _messages = await db.select().from(messages).where(eq(messages.chatId, body.chatId))
    return NextResponse.json(_messages)
}
