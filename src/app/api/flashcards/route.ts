import { NextResponse } from "next/server";
import pool from "@/app/libs/postgrase";
// GET Request to fetch flashcards
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');

        if (!user_id) {
            return NextResponse.json({ error: "Missing user_id parameter" }, { status: 400 });
        }

        const query = 'SELECT * FROM flashcards WHERE user_id = $1';
        const { rows } = await pool.query(query, [user_id]); // Use $1 for positional parameter
        console.log("rows", rows);

        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
    const err = error as Error;
        return NextResponse.json({
            error: err || "Error fetching flashcards"
        }, { status: 500 });
    }
}

// POST Request to create a new flashcard
export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const body = await req.json();
        const { flashcardtopics } = body;

        if (!user_id || !flashcardtopics) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const query = `INSERT INTO flashcards (user_id, flashcardtopics) VALUES ($1, $2) RETURNING id`;
        const { rows } = await pool.query(query, [user_id, flashcardtopics]);

        return NextResponse.json({ message: "Flashcard created successfully", id: rows[0].id }, { status: 200 });
    } catch (error) {
    const err = error as Error;
        return NextResponse.json({
            error: err || "Error inserting flashcards info"
        }, { status: 500 });
    }
}

// PUT Request to update a flashcard
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { user_id, flashcardtopics, flashcardtopicsId } = body;

        if (!user_id || !flashcardtopics || !flashcardtopicsId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const query = `UPDATE flashcards SET flashcardtopics = $1 WHERE user_id = $2 AND id = $3`;
        await pool.query(query, [flashcardtopics, user_id, flashcardtopicsId]);

        return NextResponse.json({ message: "Flashcard updated successfully" }, { status: 200 });
    } catch (error) {
    const err = error as Error;
        return NextResponse.json({
            error: err || "Error updating flashcard"
        }, { status: 500 });
    }
}

// DELETE Request to remove a flashcard
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const flashcards_id = searchParams.get('id');

        if (!user_id || !flashcards_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const query1 = `DELETE FROM flashcards WHERE user_id = $1 AND id = $2`;
        const query2 = `DELETE FROM queAns WHERE user_id = $1 AND flashcards_id = $2`;

        await pool.query(query1, [user_id, flashcards_id]);
        await pool.query(query2, [user_id, flashcards_id]);

        return NextResponse.json({ message: "Flashcards deleted successfully" }, { status: 200 });
    } catch (error) {
    const err = error as Error;
        return NextResponse.json({
            error: err || "Error deleting flashcards info"
        }, { status: 500 });
    }
}
