import { NextResponse } from "next/server";
import pool from "@/app/libs/mysql";

export async function POST(req : Request) {
    try {

        const credentials = await req.json();
        const {email, password} = credentials;
        console.log(email , password)
        const db = await pool.getConnection();
        const query = 'SELECT * FROM users where email = ? and password = ?';
        const [rows] = await db.execute(query, [email, password]);
        db.release();

        console.log(rows)
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error : any) {
        return NextResponse.json({
            error: error.message || "Error fetching users"
        }, { status: 500 });
    }
}
