import Product from "@/models/Product";
import { notFound } from "next/navigation";
import { ProductForm } from "../../components/ProductForm";
import connectToDatabase from "@/lib/mongodb";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = params;

  await connectToDatabase();
  const product = await Product.findById(id).lean();

  if (!product) {
    notFound();
  }

  // Convert Mongoose document to plain object
  const productObj = JSON.parse(JSON.stringify(product));

  // Add the id as a string
  productObj._id = id;

  return <ProductForm initialData={productObj} />;
}
