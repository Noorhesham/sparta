"use client";

import React, { useState, useTransition } from "react";
import { useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { LoadingButton } from "@/app/components/ui/loading-button";
import FormInput from "@/app/components/inputs/FormInput";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { Trash2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Description schema for validation
const descriptionSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
});

// Service schema for validation
const serviceSchema = z.object({
  _id: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  slug: z.string().optional(),
  descriptions: z.array(descriptionSchema).min(1, "At least one description is required"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: ServiceFormValues;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.services");
  const common = useTranslations("dashboard.common");
  const [isPending, startTransition] = useTransition();

  // Initialize form with default values or initial data
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      icon: "",
      title_en: "",
      title_ar: "",
      slug: "",
      descriptions: [
        {
          title_en: "",
          title_ar: "",
          description_en: "",
          description_ar: "",
        },
      ],
    },
  });

  // Setup field array for handling dynamic descriptions
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "descriptions",
  });

  // Generate slug from English title
  const titleEn = form.watch("title_en");
  React.useEffect(() => {
    if (titleEn && !initialData && !form.getValues("slug")) {
      const generatedSlug = titleEn
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      form.setValue("slug", generatedSlug);
    }
  }, [titleEn, form, initialData]);

  // Show form errors
  React.useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      toast.error(
        Object.values(form.formState.errors)
          .map((error) => error.message)
          .join(", ")
      );
    }
  }, [form.formState.errors]);

  // Handle form submission
  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
    startTransition(async () => {
      try {
        // Clean the data
        const cleanData = JSON.parse(JSON.stringify(data));

        // Generate slug if empty
        if (!cleanData.slug) {
          cleanData.slug = cleanData.title_en
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
        }

        // Remove empty _id if it's a new service
        if (cleanData._id === "") {
          delete cleanData._id;
        }

        // Create or update entity
        const res = initialData
          ? await updateEntity("Service", initialData._id as string, cleanData)
          : await createEntity("Service", cleanData);

        if (res.success) {
          toast.success(initialData ? t("updateSuccess") : t("createSuccess"));
          router.push(`/${locale}/dashboard/services`);
        } else {
          toast.error(res.message || t("error"));
        }
      } catch (error) {
        console.error("Service form error:", error);
        toast.error(t("error"));
      }
    });
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editService") : t("createService")}</h1>
            <LoadingButton type="submit" isLoading={isPending}>
              {initialData ? common("update") : common("create")}
            </LoadingButton>
          </div>

          <Separator />

          {/* Main Service Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput name="icon" label={t("form.icon")} photo single />

              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.title_en")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter English title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.title_ar")}</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل العنوان بالعربية" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.slug")}</FormLabel>
                      <FormControl>
                        <Input placeholder="service-url-slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        {locale === "ar"
                          ? "سيتم إنشاؤه تلقائيًا من العنوان الإنجليزي إذا تُرك فارغًا"
                          : "Will be auto-generated from English title if left empty"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Service Descriptions */}
          <div className="p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("form.descriptions")}</h2>
              <Button
                type="button"
                onClick={() =>
                  append({
                    title_en: "",
                    title_ar: "",
                    description_en: "",
                    description_ar: "",
                  })
                }
              >
                {t("form.addDescription")}
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {locale === "ar" ? `الوصف ${index + 1}` : `Description ${index + 1}`}
                      </CardTitle>
                      {fields.length > 1 && (
                        <Button variant="ghost" size="sm" type="button" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`descriptions.${index}.title_en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.description_title_en")}</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter English title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`descriptions.${index}.title_ar`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.description_title_ar")}</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل العنوان بالعربية" {...field} dir="rtl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`descriptions.${index}.description_en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.description_content_en")}</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter English description" className="min-h-32" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`descriptions.${index}.description_ar`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.description_content_ar")}</FormLabel>
                            <FormControl>
                              <Textarea placeholder="أدخل الوصف بالعربية" className="min-h-32" {...field} dir="rtl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
