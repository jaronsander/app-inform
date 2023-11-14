import { NextResponse } from "next/server"
import { generator } from "@/util/ai"

export const POST = async (request: Request) => {
    const {messages} = await request.json()
    console.log(messages)
    const result = await generator(messages)
    return NextResponse.json({ data: result})
}