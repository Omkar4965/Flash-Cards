import { NextResponse } from "next/server";
import pool from "@/app/libs/mysql";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing


export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("body")
        const { name, email, password } = body;

        console.log("ddddddddd", name, email, password )

        // Hash the password before storing it
        // const hashedPassword = await bcrypt.hash(password, 10);

        const db = await pool.getConnection();
        const query = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
        await db.execute(query, [name, email, password]);
        db.release();

        return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Error inserting user:", error);
        return NextResponse.json({
            error: "Error inserting user"
        }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const body = await req.json();
        console.log("body")
        const { name, email, password } = body;

        console.log("ddddddddd", name, email, password )

        // Hash the password before storing it
        // const hashedPassword = await bcrypt.hash(password, 10);

        const db = await pool.getConnection();
        const query = `INSERT INTO users (name, email, password) VALUES (?,?,?)`;
        await db.execute(query, [name, email, password]);
        db.release();

        return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Error inserting user:", error);
        return NextResponse.json({
            error: "Error inserting user"
        }, { status: 500 });
    }
}
