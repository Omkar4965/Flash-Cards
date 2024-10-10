import { NextResponse } from "next/server";
import pool from "@/app/libs/mysql";

export async function GET(req) {
    let db;
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const flashcards_id = searchParams.get('flashcards_id');
        
        if (!user_id || !flashcards_id) {
            return NextResponse.json({
                error: "Missing required query parameters: user_id or flashcards_id"
            }, { status: 400 });
        }

        console.log("user_id", user_id);
        console.log("flashcards_id", flashcards_id);

        db = await pool.getConnection();
        const query = 'SELECT * FROM queAns WHERE user_id = ? AND flashcards_id = ?';
        const [rows] = await db.execute(query, [user_id, flashcards_id]);
        
        console.log("rows", rows);

        return NextResponse.json(rows, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching queAns:", error);
        return NextResponse.json({
            error: error.message || "Error fetching queAns"
        }, { status: 500 });
    } finally {
        if (db) {
            db.release(); // Make sure the connection is always released
        }
    }
}

export async function POST(req: any) {
    try {
        // Parse request body
        const body = await req.json();
        const {user_id, flashcards_id , question, answer} = body;

        // Validate input
        if (!user_id || !flashcards_id || !question || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Securely insert data using prepared statements
        const db = await pool.getConnection();
        const query = `INSERT INTO queAns (user_id, flashcards_id , question, answer) VALUES (?,?,?,?)`;
        await db.execute(query, [user_id, flashcards_id , question, answer]);  // Pass the values as an array to prevent SQL injection
        db.release();
        
        return NextResponse.json({ message: "aue ans added successfully" }, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error inserting queAns info"
        }, { status: 500 });
    }
}


export async function PUT(req: any) {
    try {
        // Parse request body
        const body = await req.json();
        const { question, answer, newquestion, newanswer } = body;

        // Validate input
        if (!question || !answer || !newquestion || !newanswer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = await pool.getConnection();
        const query = `UPDATE queAns SET question = ?, answer = ? WHERE question = ? AND answer = ?`;
        const [result] = await db.execute(query, [newquestion, newanswer, question, answer]);
        db.release();

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return NextResponse.json({ message: `No record found to update for question: ${question}, answer: ${answer}` }, { status: 404 });
        }

        return NextResponse.json({ message: "Answer updated successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Error updating queAns info"
        }, { status: 500 });
    }
}


export async function DELETE(req: any) {
    try {
        const { searchParams } = new URL(req.url);
        const question = searchParams.get('question');
        const answer = searchParams.get('answer');

        const db = await pool.getConnection();
        const query = 'DELETE FROM queAns WHERE question = ? AND answer = ?;';
        const [result] = await db.execute(query, [question, answer]);  // Correct placeholders
        db.release();

        // Check if a record was actually deleted
        if (result.affectedRows === 0) {
            return NextResponse.json({ message: `No record found to delete for question: ${question}, answer: ${answer}` }, { status: 404 });
        }

        return NextResponse.json("Record deleted successfully", { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Error deleting queAns"
        }, { status: 500 });
    }
}

