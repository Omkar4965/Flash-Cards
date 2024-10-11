import { NextResponse } from "next/server";
import pool from "@/app/libs/postgrase";

export async function POST(req : Request) {
    try {

        const credentials = await req.json();
        const {email, password} = credentials;
        console.log(email , password)
        const query = 'SELECT * FROM users where email = $1 and password = $2';
        const {rows} = await pool.query(query, [email, password]);

        console.log(rows)
        
        return NextResponse.json(rows, { status: 200 });
    } catch (error ) {
        const err = error as Error;
        return NextResponse.json({
            error: err || "Error fetching users"
        }, { status: 500 });
    }
}