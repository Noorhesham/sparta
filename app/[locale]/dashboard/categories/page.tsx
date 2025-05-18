import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import Category from "@/models/Category";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CategoryModal from "./CategoryModal";
import { DataTable } from "@/app/components/DataTable";
import { columns } from "./columns";
import ModelCustom from "@/app/components/ModelCustom";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage product categories",
};

async function getCategories() {
  await connectToDatabase();
  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  return categories.map((category: any) => ({
    ...category,
    id: category._id.toString(),
    _id: category._id.toString(),
  }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <ModelCustom
          title="Add New Category"
          btn={<Button>Add New Category</Button>}
          content={<CategoryModal mode="create" />}
        />
      </div>

      <div className="rounded-md border">
        <DataTable columns={columns} data={categories} searchKey="name_en" />
      </div>
    </div>
  );
}
