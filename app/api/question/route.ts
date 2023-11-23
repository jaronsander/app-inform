import { NextResponse } from "next/server"
import { generator } from "@/util/ai"

export const POST = async (request: Request) => {
    const {data} = await request.json()
    console.log(data)
    const result = await generator(data)
    return NextResponse.json({ data: result})
}