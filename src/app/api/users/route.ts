import { NextResponse } from "next/server";
import pool from "@/app/libs/mysql";

export async function GET() {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT * FROM users';
        const [rows] = await db.execute(query);
        db.release();
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error fetching users"
        }, { status: 500 });
    }
}

export async function POST(req: any) {
    try {
        // Parse request body
        const body = await req.json();
        const {name, email, password } = body;

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Securely insert data using prepared statements
        const db = await pool.getConnection();
        const query = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
        await db.execute(query, [name, email, password]);  // Pass the values as an array to prevent SQL injection
        db.release();
        
        return NextResponse.json({ message: "User added successfully" }, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error inserting user"
        }, { status: 500 });
    }
}
