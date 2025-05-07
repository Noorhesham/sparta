"use client";

import React, { useEffect, useTransition } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { homepageSchema, HomepageFormValues } from "@/app/validations/homepage";
import FormInput from "@/app/components/inputs/FormInput";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingButton } from "@/app/components/ui/loading-button";
import ArabicEnglishForm from "@/app/components/inputs/ArabicEnglishForm";

interface HomepageFormProps {
  initialData?: HomepageFormValues;
}

export function HomepageForm({ initialData }: HomepageFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.homepage");
  const common = useTranslations("dashboard.common");
  const [isPending, startTransition] = useTransition();

  // Initialize form with default values or initial data
  const form = useForm<HomepageFormValues>({
    resolver: zodResolver(homepageSchema),
    defaultValues: initialData || {
      hero: {
        title: { en: "", ar: "" },
        subtitle: { en: "", ar: "" },
        description: { en: "", ar: "" },
        backgroundImage: "",
        buttonText: { en: "", ar: "" },
        buttonLink: "",
      },
      about: {
        title: { en: "", ar: "" },
        miniTitle: { en: "", ar: "" },
        description: { en: "", ar: "" },
        link: "",
        linkText: { en: "", ar: "" },
        mainImage: "",
      },
      aboutServices: [],
      logos: [],
      services: [],
      technologiesSection: {
        technologies: [],
      },
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
  const onSubmit: SubmitHandler<HomepageFormValues> = async (data) => {
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
          ? await updateEntity("Homepage", initialData._id as string, cleanData)
          : await createEntity("Homepage", cleanData);

        if (res.success) {
          toast.success(initialData ? t("updateSuccess") : t("createSuccess"));
          router.push(`/${locale}/dashboard/homepage`);
        } else {
          toast.error(res.message || t("error"));
        }
      } catch (error) {
        console.error("Homepage form error:", error);
        toast.error(t("error"));
      }
    });
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editHomepage") : t("createHomepage")}</h1>
            <LoadingButton type="submit" isLoading={isPending}>
              {initialData ? common("update") : common("create")}
            </LoadingButton>
          </div>

          <Separator />

          {/* Hero Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.hero")}</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <ArabicEnglishForm name="hero.title" label={t("form.title")} />
                <ArabicEnglishForm name="hero.subtitle" label={t("form.subtitle")} />
                <ArabicEnglishForm name="hero.description" label={t("form.description")} area />
                <FormInput name="hero.backgroundImage" photo single label={t("form.image")} />
                <ArabicEnglishForm name="hero.buttonText" label={t("form.buttonText")} />
                <FormInput name="hero.buttonLink" label={t("form.buttonLink")} />
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.about")}</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <ArabicEnglishForm name="about.title" label={t("form.title")} />
                <ArabicEnglishForm name="about.miniTitle" label={t("form.miniTitle")} />
                <ArabicEnglishForm name="about.description" label={t("form.description")} area />
                <FormInput name="about.link" label={t("form.link")} />
                <ArabicEnglishForm name="about.linkText" label={t("form.linkText")} />
                <FormInput name="about.mainImage" photo single label={t("form.image")} />
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.services")}</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormInput name="services" label={t("form.services")} area />
              </CardContent>
            </Card>
          </div>

          {/* Logos Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.logos")}</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormInput name="logos" photo label={t("form.logos")} />
              </CardContent>
            </Card>
          </div>

          {/* Technologies Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.technologies")}</h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormInput name="technologiesSection.technologies" photo label={t("form.technologies")} />
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
