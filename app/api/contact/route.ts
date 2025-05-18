import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ContactUs from "@/models/ContactUs";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Extract and validate required fields
    const { first_name, last_name, email, phone_number, service } = body;

    if (!first_name || !last_name || !email || !phone_number || !service) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create new contact entry
    const newContact = new ContactUs({
      first_name,
      last_name,
      email,
      phone_number,
      service_id: service, // In a real app, you would have service IDs from the database
      message: body.message || "",
    });

    // Save to database
    await newContact.save();

    return NextResponse.json({ success: "Contact form submitted successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving contact form:", error);
    return NextResponse.json({ error: error.message || "Failed to submit contact form" }, { status: 500 });
  }
}
