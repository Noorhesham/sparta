import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch all team members
    const teamMembers = await TeamMember.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(teamMembers);
  } catch (error: any) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch team members" }, { status: 500 });
  }
}
