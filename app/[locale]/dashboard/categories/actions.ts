"use server";

import { revalidatePath } from "next/cache";
import Category from "@/models/Category";
import connectToDatabase from "@/lib/mongodb";

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createCategory(data: { name_en: string; name_ar: string }) {
  try {
    await connectToDatabase();

    // Check if category already exists
    const existingCategoryEn = await Category.findOne({ name_en: data.name_en });
    if (existingCategoryEn) {
      return { error: "A category with this English name already exists" };
    }

    const existingCategoryAr = await Category.findOne({ name_ar: data.name_ar });
    if (existingCategoryAr) {
      return { error: "A category with this Arabic name already exists" };
    }

    // Generate slug from English name
    const slug = generateSlug(data.name_en);

    // Check if slug exists
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      return { error: "A category with this slug already exists" };
    }

    // Create new category
    const category = await Category.create({
      name_en: data.name_en,
      name_ar: data.name_ar,
      slug,
    });

    revalidatePath("/[locale]/dashboard/categories");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Failed to create category:", error);
    return { error: error.message || "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: { name_en: string; name_ar: string }) {
  try {
    await connectToDatabase();

    // Check if category with updated name already exists (excluding current)
    const existingCategoryEn = await Category.findOne({
      name_en: data.name_en,
      _id: { $ne: id },
    });
    if (existingCategoryEn) {
      return { error: "A category with this English name already exists" };
    }

    const existingCategoryAr = await Category.findOne({
      name_ar: data.name_ar,
      _id: { $ne: id },
    });
    if (existingCategoryAr) {
      return { error: "A category with this Arabic name already exists" };
    }

    // Generate new slug from English name
    const slug = generateSlug(data.name_en);

    // Check if slug exists (excluding current)
    const existingSlug = await Category.findOne({ slug, _id: { $ne: id } });
    if (existingSlug) {
      return { error: "A category with this slug already exists" };
    }

    // Update category
    const category = await Category.findByIdAndUpdate(
      id,
      {
        name_en: data.name_en,
        name_ar: data.name_ar,
        slug,
      },
      { new: true }
    );

    if (!category) {
      return { error: "Category not found" };
    }

    revalidatePath("/[locale]/dashboard/categories");
    return { success: true, data: category };
  } catch (error: any) {
    console.error("Failed to update category:", error);
    return { error: error.message || "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToDatabase();

    // Check if category is being used by any products
    const Product = (await import("@/models/Product")).default;
    const productsWithCategory = await Product.findOne({ category: id });

    if (productsWithCategory) {
      return { error: "Cannot delete category as it is being used by products" };
    }

    // Delete category
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return { error: "Category not found" };
    }

    revalidatePath("/[locale]/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return { error: error.message || "Failed to delete category" };
  }
}
