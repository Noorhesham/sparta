"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCategory, updateCategory } from "./actions";
import { Category } from "./columns";
import { FormLabel, FormMessage, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name_en: z.string().min(1, { message: "English name is required" }),
  name_ar: z.string().min(1, { message: "Arabic name is required" }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryModalProps {
  children?: React.ReactNode;
  mode?: "create" | "edit";
  category?: Category;
}

export default function CategoryModal({ mode = "create", category }: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: category?.name_en || "",
      name_ar: category?.name_ar || "",
    },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      // Ensure values are not undefined
      const categoryData = {
        name_en: values.name_en,
        name_ar: values.name_ar,
      };

      if (mode === "edit" && category) {
        const result = await updateCategory(category.id, categoryData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Category updated successfully");
      } else {
        const result = await createCategory(categoryData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Category created successfully");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("An error occurred");
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="name_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>English Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter category name in English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arabic Name</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم الفئة بالعربية" {...field} dir="rtl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{mode === "edit" ? "Update" : "Create"}</Button>
        </div>
      </form>
    </FormProvider>
  );
}
