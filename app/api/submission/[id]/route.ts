import { prisma } from "@/util/db"
import { NextResponse } from "next/server";
export const POST = async (req: Request, {params}) => {
    
    const { body } = await req.json()
    const { id } = params
    console.log(body);
    const thread = await prisma.thread.create({
        data: {
            ...body,
            submissionId: parseInt(id),
        }
    })
    return NextResponse.json({data: thread})
}