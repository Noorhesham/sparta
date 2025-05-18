import { NextResponse } from "next/server";
import Service from "@/models/Service";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    // Get all active services
    const services = await (Service as any).find({ isActive: true }).lean();

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ message: "Failed to fetch services", error: (error as Error).message }, { status: 500 });
  }
}
