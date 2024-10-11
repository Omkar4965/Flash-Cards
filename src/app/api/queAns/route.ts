import { NextResponse } from "next/server";
import pool from "@/app/libs/postgrase"; // Ensure PostgreSQL pool connection

// GET Request to fetch queAns
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const flashcards_id = searchParams.get('flashcards_id');
        
        if (!user_id || !flashcards_id) {
            return NextResponse.json({
                error: "Missing required query parameters: user_id or flashcards_id"
            }, { status: 400 });
        }

        const query = 'SELECT * FROM queAns WHERE user_id = $1 AND flashcards_id = $2';
        const { rows } = await pool.query(query, [user_id, flashcards_id]);
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching queAns:", error);
        return NextResponse.json({
            error: error.message || "Error fetching queAns"
        }, { status: 500 });
    } 
}

// POST Request to insert queAns
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { user_id, flashcards_id, question, answer } = body;

        if (!user_id || !flashcards_id || !question || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const query = `INSERT INTO queAns (user_id, flashcards_id, question, answer) VALUES ($1, $2, $3, $4)`;
        await pool.query(query, [user_id, flashcards_id, question, answer]);
        
        return NextResponse.json({ message: "QueAns added successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Error inserting queAns info"
        }, { status: 500 });
    }
}

// PUT Request to update queAns
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { question, answer, newquestion, newanswer } = body;

        if (!question || !answer || !newquestion || !newanswer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const query = `UPDATE queAns SET question = $1, answer = $2 WHERE question = $3 AND answer = $4`;
        const res = await pool.query(query, [newquestion, newanswer, question, answer]);

        if (res.rowCount === 0) {
            return NextResponse.json({ message: `No record found to update for question: ${question}, answer: ${answer}` }, { status: 404 });
        }

        return NextResponse.json({ message: "QueAns updated successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Error updating queAns info"
        }, { status: 500 });
    }
}

// DELETE Request to delete queAns
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const question = searchParams.get('question');
        const answer = searchParams.get('answer');

        if (!question || !answer) {
            return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
        }

        const query = 'DELETE FROM queans WHERE question = $1 AND answer = $2';
        const res = await pool.query(query, [question, answer]);

        if (res.rowCount === 0) {
            return NextResponse.json({ message: `No record found to delete for question: ${question}, answer: ${answer}` }, { status: 404 });
        }

        return NextResponse.json({ message: "Record deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message || "Error deleting queAns"
        }, { status: 500 });
    }
}
