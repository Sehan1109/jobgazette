// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import User from "../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        await connectDB();

        // Email එක කලින් තියෙනවද බලන්න
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        // Password එක Hash කරන්න
        const hashedPassword = await bcrypt.hash(password, 10);

        // අලුත් User හදන්න (පළවෙනි User Admin කරන්න ඕන නම් DB එකෙන් පස්සේ වෙනස් කරගන්න)
        await User.create({ name, email, password: hashedPassword, role: "user" });

        return NextResponse.json({ message: "User registered!" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error registering user" }, { status: 500 });
    }
}