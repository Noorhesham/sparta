"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Text, ImageIcon } from "lucide-react";
import { BlogFormValues, SectionType, blogSchema } from "@/app/validations/blog";
import FormInput from "@/app/components/inputs/FormInput";
import ArabicEnglishForm from "@/app/components/inputs/ArabicEnglishForm";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Simple function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Function to generate a slug from a title
const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Function to recursively get all error messages from nested form errors
const getNestedErrorMessages = (errors: any): string[] => {
  if (!errors) return [];

  return Object.entries(errors).flatMap(([key, value]: [string, any]) => {
    // If it has a message property, it's a leaf error node
    if (value?.message) {
      return [`${key}: ${value.message}`];
    }

    // If it's an object with nested errors
    if (typeof value === "object") {
      const nestedMessages = getNestedErrorMessages(value);
      if (nestedMessages.length > 0) {
        // If the key is a number (array index), don't prefix it
        return isNaN(Number(key)) ? nestedMessages.map((msg) => `${key}.${msg}`) : nestedMessages;
      }
    }

    return [];
  });
};

interface BlogFormProps {
  initialData?: BlogFormValues;
}

// Section Item Component
function SectionItem({
  section,
  index,
  onRemove,
  t,
}: {
  section: SectionType;
  index: number;
  onRemove: () => void;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <Card className="mb-4 border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <CardTitle className="text-lg">
            {section.type === "text" ? (
              <div className="flex items-center">
                <Text className="h-5 w-5 mr-2" />
                {t("form.sections.text")}
              </div>
            ) : (
              <div className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                {t("form.sections.image")}
              </div>
            )}
          </CardTitle>
        </div>

        <Button variant="outline" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        {section.type === "text" && (
          <ArabicEnglishForm name={`sections.${index}.content`} label={t("form.sections.content")} area={true} />
        )}

        {section.type === "image" && (
          <>
            <FormInput name={`sections.${index}.imageUrl`} label={t("form.sections.imageUrl")} photo single />

            <div className="mt-4">
              <ArabicEnglishForm name={`sections.${index}.caption`} label={t("form.sections.caption")} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.blogs");
  const common = useTranslations("dashboard.common");
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);

  // Initialize form with default values or initial data
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: { en: "", ar: "" },
      slug: "",
      description: { en: "", ar: "" },
      author: "",
      mainImage: "",
      thumbnailImage: "",
      sections: [],
      published: false,
      featured: false,
    },
  });

  // Show toast for form errors with better nested error handling
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      const errorMessages = getNestedErrorMessages(form.formState.errors);

      if (errorMessages.length > 0) {
        toast.error(
          <div className="space-y-1">
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="list-disc pl-4">
              {errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        );
      }
    }
  }, [form.formState.errors]);

  // Get form methods
  const { handleSubmit, control, watch, setValue } = form;

  // Set up field array for dynamic sections
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  // Watch form values
  const watchPublished = watch("published");
  const watchFeatured = watch("featured");
  const titleEn = watch("title.en");
  const titleAr = watch("title.ar");
  const currentSlug = watch("slug");

  // Auto-generate slug when English title changes
  useEffect(() => {
    if (titleEn && (!currentSlug || currentSlug === "")) {
      setValue("slug", generateSlug(titleEn));
    }
  }, [titleEn, currentSlug, setValue]);

  // Add a new section
  const addSection = (type: "text" | "image") => {
    const newOrder = fields.length;

    if (type === "text") {
      append({
        id: generateId(),
        type: "text",
        content: { en: "", ar: "" },
        order: newOrder,
      });
    } else {
      append({
        id: generateId(),
        type: "image",
        imageUrl: "",
        caption: { en: "", ar: "" },
        order: newOrder,
      });
    }

    setIsAddingSectionOpen(false);
  };

  // Handle form submission
  const onSubmit = async (data: BlogFormValues) => {
    try {
      // Create a clean copy of the data to avoid circular references
      const cleanData = JSON.parse(JSON.stringify(data));

      // Generate slug if empty
      if (!cleanData.slug) {
        cleanData.slug = generateSlug(cleanData.title.en);
      }

      // Ensure sections have correct order
      cleanData.sections = cleanData.sections.map((section: SectionType, index: number) => ({
        ...section,
        order: index,
      }));

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

        router.push(`/${locale}/dashboard/blogs`);
      } else {
        toast.error(res.message || t("error"));
      }
    } catch (error) {
      console.error("Blog form error:", error);
      toast.error(t("error"));
    }
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editBlog") : t("createBlog")}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={watchPublished}
                  onCheckedChange={(checked) => setValue("published", checked)}
                />
                <Label htmlFor="published">{t("form.published")}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={watchFeatured}
                  onCheckedChange={(checked) => setValue("featured", checked)}
                />
                <Label htmlFor="featured">{t("form.featured")}</Label>
              </div>

              <Button type="submit">{initialData ? common("update") : common("create")}</Button>
            </div>
          </div>

          <Separator />

          {/* Main Blog Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo") || "Blog Information"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ArabicEnglishForm name="title" label={t("form.title")} />
                <FormInput
                  name="slug"
                  label={t("form.slug")}
                  placeholder={t("form.slugPlaceholder")}
                  help={t("form.slugHelp") || "Auto-generated from title if left empty"}
                />
                <ArabicEnglishForm name="description" label={t("form.description")} area />
                <FormInput name="author" label={t("form.author")} placeholder={t("form.authorPlaceholder")} />
              </div>

              <div>
                <FormInput
                  name="mainImage"
                  label={t("form.mainImage")}
                  placeholder={t("form.mainImagePlaceholder")}
                  photo
                  single
                />
                <FormInput
                  name="thumbnailImage"
                  label={t("form.thumbnailImage")}
                  placeholder={t("form.thumbnailImagePlaceholder")}
                  photo
                  single
                />
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("form.sections.title")}</h2>

              {isAddingSectionOpen ? (
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => addSection("text")}>
                    <Text className="h-4 w-4 mr-2" />
                    {t("form.sections.addText")}
                  </Button>

                  <Button type="button" variant="outline" onClick={() => addSection("image")}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {t("form.sections.addImage")}
                  </Button>

                  <Button type="button" variant="ghost" onClick={() => setIsAddingSectionOpen(false)}>
                    {common("cancel")}
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={() => setIsAddingSectionOpen(true)} className="inline-flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("form.sections.addSection")}
                </Button>
              )}
            </div>

            {fields.length === 0 ? (
              <div className="text-center p-10 border border-dashed rounded-lg">
                <p className="text-muted-foreground">{t("form.sections.empty")}</p>
                <Button type="button" variant="outline" className="mt-4" onClick={() => setIsAddingSectionOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("form.sections.addSection")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((section, index) => (
                  <SectionItem
                    key={section.id || `section-${index}`}
                    section={section as SectionType}
                    index={index}
                    onRemove={() => remove(index)}
                    t={t}
                  />
                ))}
              </div>
            )}
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
