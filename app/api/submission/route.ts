import clientPromise from "@/util/mongodb";
import { NextResponse } from "next/server"
export const POST = async (req: Request) => {
    try {
        const client = await clientPromise;
        const { body } = await req.json()
        console.log(body)
        if (!body) {
            throw new Error("Request body is missing or empty.");
        }

        const db = client.db('inform');
        const collection = db.collection('submissions');

        const result = await collection.insertOne(body);

        return NextResponse.json({ data: result });
    } catch (error) {
        console.error("Error in createSubmission route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};