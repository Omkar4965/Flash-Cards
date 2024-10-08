import { NextResponse } from "next/server";
import pool from "@/app/libs/mysql";

export async function GET() {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT * FROM flashcards';
        const [rows] = await db.execute(query);
        db.release();
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error fetching flashcards"
        }, { status: 500 });
    }
}

export async function POST(req: any) {
    try {
        // Parse request body
        const body = await req.json();
        const {user_id, flashcardTopics } = body;

        // Validate input
        if (!user_id || !flashcardTopics) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Securely insert data using prepared statements
        const db = await pool.getConnection();
        const query = `INSERT INTO flashcards (user_id, flashcardTopics) VALUES (?,?)`;
        await db.execute(query, [user_id, flashcardTopics]);  // Pass the values as an array to prevent SQL injection
        db.release();
        
        return NextResponse.json({ message: "flashcards added successfully" }, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error inserting flashcards info"
        }, { status: 500 });
    }
}
