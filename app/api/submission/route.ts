import { prisma } from "@/util/db"
import { NextResponse } from "next/server"
export const POST = async (req: Request) => {
    const { body } = await req.json()
    console.log(body)
    const submission = await prisma.submission.create({
        data: body
    })
    return NextResponse.json({data: {...submission}})

}