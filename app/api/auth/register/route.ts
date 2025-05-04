import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const { name, email, password, phone, address } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      role: "user", // Default role
      isVerified: false, // Default to unverified
    });

    await newUser.save();

    // Remove password from the response
    const user = newUser.toObject();
    delete user.password;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}
