"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/app/validations/product";
import FormInput from "@/app/components/inputs/FormInput";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface ProductFormProps {
  initialData?: ProductFormValues;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.products");
  const common = useTranslations("dashboard.common");

  // Initialize form with default values or initial data
  const form = useForm<ProductFormValues>({
    // @ts-expect-error - There's a type mismatch with the zod resolver that we can safely ignore
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      cover: "",
      project_name: "",
      slug: "",
      description: "",
      google_link: "",
      app_store_link: "",
      website_link: "",
      project_images: [],
    },
  });

  // Get form methods
  const { handleSubmit, watch, setValue } = form;

  // Watch cover image for preview
  const coverImage = watch("cover");
  const projectName = watch("project_name");

  // Generate slug from project name
  useEffect(() => {
    if (projectName && !initialData) {
      const generatedSlug = projectName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setValue("slug", generatedSlug);
    }
  }, [projectName, setValue, initialData]);

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Create a clean copy of the data to avoid circular references
      const cleanData = JSON.parse(JSON.stringify(data));

      // Generate slug if empty
      if (!cleanData.slug) {
        cleanData.slug = cleanData.project_name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "") // Remove special characters
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
      }

      // Remove empty or undefined values
      if (cleanData._id === "") {
        delete cleanData._id;
      }

      // Create or update entity
      const res = initialData
        ? await updateEntity("Product", initialData._id as string, cleanData)
        : await createEntity("Product", cleanData);

      if (res.success) {
        toast.success(initialData ? t("updateSuccess") : t("createSuccess"));
        router.push(`/${locale}/dashboard/products`);
      } else {
        toast.error(res.message || common("error"));
      }
    } catch (error) {
      console.error("Product form error:", error);
      toast.error(common("error"));
    }
  };

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error(
        Object.values(form.formState.errors)
          .map((error) => error.message)
          .join(", ")
      );
    }
  }, [form.formState.errors]);

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        {/* @ts-expect-error - The handleSubmit type mismatch can be ignored */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editProduct") : t("createProduct")}</h1>
            <Button type="submit">{initialData ? common("update") : common("create")}</Button>
          </div>

          <Separator />

          {/* Main Product Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo")}</h2>

            <div className="grid grid-cols-1 gap-6">
              <FormInput name="cover" label={t("form.cover")} photo single />

              <FormInput name="project_name" label={t("form.project_name")} />

              <FormInput name="slug" label={t("form.slug") || "Slug"} placeholder="project-url-slug" />

              <FormInput name="description" label={t("form.description")} area />
            </div>
          </div>

          {/* Product Links */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.links")}</h2>
            <div className="space-y-4">
              <FormInput name="google_link" label={t("form.google_link")} />
              <FormInput name="app_store_link" label={t("form.app_store_link")} />
              <FormInput name="website_link" label={t("form.website_link")} />
            </div>
          </div>

          {/* Project Images */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.imagesSection")}</h2>

            <Card>
              <CardContent className="pt-6">
                <FormInput name="project_images" label={t("form.project_images")} photo />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-10">
            <Button type="submit">{initialData ? common("update") : common("create")}</Button>
          </div>
        </form>
      </FormProvider>
    </MaxWidthWrapper>
  );
}
