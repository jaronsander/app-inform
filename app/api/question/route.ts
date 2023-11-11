import { NextResponse } from "next/server"
import { generator } from "@/util/ai"

export const POST = async (request: Request) => {
    const {content} = await request.json()
    console.log(content)
    const result = await generator(content)
    return NextResponse.json({ data: result})
}