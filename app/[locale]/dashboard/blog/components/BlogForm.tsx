"use client";

import React, { useEffect, useTransition } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogFormValues } from "@/app/validations/blog";
import FormInput from "@/app/components/inputs/FormInput";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingButton } from "@/app/components/ui/loading-button";
import ArabicEnglishForm from "@/app/components/inputs/ArabicEnglishForm";

interface BlogFormProps {
  initialData?: BlogFormValues;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.blog");
  const common = useTranslations("dashboard.common");
  const [isPending, startTransition] = useTransition();

  // Initialize form with default values or initial data
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: { en: "", ar: "" },
      description: { en: "", ar: "" },
      content: { en: "", ar: "" },
      image: "",
      author: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error(
        Object.values(form.formState.errors)
          .map((error) => error.message)
          .join(", ")
      );
    }
  }, [form.formState.errors]);

  // Get form methods
  const { handleSubmit } = form;

  // Handle form submission
  const onSubmit: SubmitHandler<BlogFormValues> = async (data) => {
    startTransition(async () => {
      try {
        // Create a clean copy of the data to avoid circular references
        const cleanData = JSON.parse(JSON.stringify(data));

        // Remove empty or undefined values
        if (cleanData._id === "") {
          delete cleanData._id;
        }

        // Create or update entity
        const res = initialData
          ? await updateEntity("Blog", initialData._id as string, cleanData)
          : await createEntity("Blog", cleanData);

        if (res.success) {
          toast.success(initialData ? t("updateSuccess") : t("createSuccess"));
          router.push(`/${locale}/dashboard/blog`);
        } else {
          toast.error(res.message || t("error"));
        }
      } catch (error) {
        console.error("Blog form error:", error);
        toast.error(t("error"));
      }
    });
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editBlog") : t("createBlog")}</h1>
            <LoadingButton type="submit" isLoading={isPending}>
              {initialData ? common("update") : common("create")}
            </LoadingButton>
          </div>

          <Separator />

          {/* Blog Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <ArabicEnglishForm name="title" label={t("form.title")} />
                  <ArabicEnglishForm name="description" label={t("form.description")} area />
                  <FormInput name="image" photo single label={t("form.image")} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormInput name="author" label={t("form.author")} />
                  <FormInput name="date" type="date" label={t("form.date")} />
                  <FormInput name="category" label={t("form.category")} />
                  <FormInput name="tags" label={t("form.tags")} placeholder={t("form.tagsPlaceholder")} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.content")}</h2>
            <Card>
              <CardContent className="pt-6">
                <ArabicEnglishForm name="content" label={t("form.content")} area />
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-10">
            <LoadingButton type="submit" isLoading={isPending}>
              {initialData ? common("update") : common("create")}
            </LoadingButton>
          </div>
        </form>
      </FormProvider>
    </MaxWidthWrapper>
  );
}
