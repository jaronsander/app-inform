import clientPromise from "@/util/mongodb";
import { NextResponse } from "next/server";
import {ObjectId} from 'mongodb';
export const POST = async (req: Request, {params}) => {
    try {
        const client = await clientPromise;
        const { body } = await req.json();
        const { id } = params;
        console.log(body);

        if (!id || !body) {
            throw new Error("Submission ID or questions array is missing.");
        }

        const db = client.db('inform');
        const collection = db.collection('submissions');
        console.log(id);
        console.log(body);
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $push: { thread: {$each: body } },
            $set: { updatedAt: new Date() }
        }); 
        console.log(result);

        return NextResponse.json({ data: result });
    } catch (error) {
        console.error("Error in updateEntryThread route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}