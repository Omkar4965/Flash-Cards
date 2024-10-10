import { NextResponse } from "next/server";
import pool from "@/app/libs/mysql";

export async function GET(req) {
    try {

        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');

        const db = await pool.getConnection();
        const query = 'SELECT * FROM flashcards WHERE user_id = ?';
        const [rows] = await db.execute(query, [user_id]);
        console.log("rows", rows)
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
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const body = await req.json();
        const { flashcardTopics } = body;

        // Validate input
        if (!user_id || !flashcardTopics) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Securely insert data using prepared statements
        const db = await pool.getConnection();
        const query = `INSERT INTO flashcards (user_id, flashcardTopics) VALUES (?,?)`;
        const res =  await db.execute(query, [user_id, flashcardTopics]);  // Pass the values as an array to prevent SQL injection
        db.release();
        
        return NextResponse.json({ msg : "new flash created succesfully", id : res[0].insertId }, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error inserting flashcards info"
        }, { status: 500 });
    }
}

export async function PUT(req: any) {
    try {
        
        const body = await req.json();
        const {user_id, flashcardTopics, flashcardTopicsId } = body;

        // Validate input
        if (!user_id || !flashcardTopics) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Securely insert data using prepared statements
        const db = await pool.getConnection();
        const query = `UPDATE flashcards set flashcardTopics = ? where user_id = ? and id = ?`;
        const res =  await db.execute(query, [ flashcardTopics, user_id, flashcardTopicsId]);  // Pass the values as an array to prevent SQL injection
        db.release();
        
        return NextResponse.json({ msg : "new flash updated succesfully",  }, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error inserting flashcards info"
        }, { status: 500 });
    }
}


export async function DELETE(req: any) {
    try {
        // Parse request body
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');
        const flashcards_id = searchParams.get('id');
        console.log("user_id", user_id);
        console.log("flashcards_id", flashcards_id);

        // Validate input
        if (!user_id || !flashcards_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Securely insert data using prepared statements
        const db = await pool.getConnection();
        const query = `DELETE FROM flashcards WHERE user_id = ? AND id = ?`;
        const res =  await db.execute(query, [user_id, flashcards_id]);  // Pass the values as an array to prevent SQL injection
        const query2 = `DELETE FROM queAns WHERE user_id = ? AND flashcards_id = ?`;
        const res2 =  await db.execute(query2, [user_id, flashcards_id]);  // Pass the values as an array to prevent SQL injection
        db.release();
        
        return NextResponse.json({ message: "flashcards deleteded successfully"}, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error inserting flashcards info"
        }, { status: 500 });
    }
}
