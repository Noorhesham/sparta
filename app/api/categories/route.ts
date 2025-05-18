import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/Category";
import connectToDatabase from "@/lib/mongodb";
// GET /api/categories - Get all categories
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories - Create a new category
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Check if category with this name already exists
    const existingCategoryEn = await Category.findOne({ name_en: body.name_en });
    if (existingCategoryEn) {
      return NextResponse.json({ error: "A category with this English name already exists" }, { status: 400 });
    }

    const existingCategoryAr = await Category.findOne({ name_ar: body.name_ar });
    if (existingCategoryAr) {
      return NextResponse.json({ error: "A category with this Arabic name already exists" }, { status: 400 });
    }

    const category = await Category.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
