import { NextResponse } from "next/server";
import pool from "@/app/libs/postgrase";
// import bcrypt from "bcrypt"; // Import bcrypt for password hashing


export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("body")
        const { name, email, password } = body;

        console.log("ddddddddd", name, email, password )

        // Hash the password before storing it
        // const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO users (name, email, password) VALUES ( $1, $2, $3)`;
        await pool.query(query, [name, email, password]);

        return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    } catch (error: any) {
        console.error("Error inserting user:", error);
        return NextResponse.json({
            error: "Error inserting user"
        }, { status: 500 });
    }
}
