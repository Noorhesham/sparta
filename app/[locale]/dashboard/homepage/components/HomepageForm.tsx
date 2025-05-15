"use client";

import React, { useEffect, useTransition } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { HomepageFormValues, homepageSchema } from "@/app/validations/homepage";
import FormInput from "@/app/components/inputs/FormInput";
import ArabicEnglishForm from "@/app/components/inputs/ArabicEnglishForm";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { LoadingButton } from "@/app/components/ui/loading-button";

interface HomepageFormProps {
  initialData?: HomepageFormValues;
}

export function HomepageForm({ initialData }: HomepageFormProps) {
  console.log(initialData);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<HomepageFormValues>({
    resolver: zodResolver(homepageSchema),
    defaultValues: initialData || {
      hero: {
        title: { en: "", ar: "" },
        subtitle: { en: "", ar: "" },
        description: { en: "", ar: "" },

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
      technologies: [],
    },
  });
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log(form.formState.errors);
      console.log(form.getValues("technologies"), form.getValues("logos"));
      toast.error(
        Object.values(form.formState.errors)
          .map((error) => error.message)
          .join(", ")
      );
    }
  }, [form.formState.errors]);
  const { handleSubmit, control } = form;
  const t = useTranslations("dashboard.homepage.form");
  const common = useTranslations("dashboard.common");

  // Use useFieldArray for dynamic arrays
  const {
    fields: aboutServices,
    append: appendAboutService,
    remove: removeAboutService,
  } = useFieldArray({
    control,
    name: "aboutServices",
  });

  const {
    fields: logos,
    append: appendLogo,
    remove: removeLogo,
  } = useFieldArray({
    control,
    name: "logos",
  });

  const {
    fields: services,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "services",
  });

  const {
    fields: technologies,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({
    control,
    name: "technologies",
  });

  const onSubmit = async (formData: HomepageFormValues) => {
    startTransition(async () => {
      try {
        // Create a clean copy of the data to avoid circular references
        const cleanData = JSON.parse(JSON.stringify(formData));

        // Remove unnecessary properties that might cause issues
        if (cleanData._id === "") {
          delete cleanData._id;
        }

        const res = initialData
          ? await updateEntity("Homepage", initialData._id as string, cleanData)
          : await createEntity("Homepage", cleanData);
        console.log(res);
        if (res.success) {
          toast.success(initialData ? "Updated successfully" : "Created successfully", {
            description: `Homepage ${initialData ? "updated" : "created"} successfully`,
          });

          // Use setTimeout to avoid potential state update issues
          setTimeout(() => {
            router.push("/dashboard/homepage");
          }, 500);
        } else {
          toast.error("Error", {
            description: res.message || "Something went wrong",
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    });
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <h1 className="text-3xl font-bold">
            {initialData ? common("edit") : common("create")} {common("homepage")}
          </h1>

          {/* Hero Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("hero.title")}</h2>
            <div className="space-y-4">
              <ArabicEnglishForm name="hero.title" label={common("title")} />
              <ArabicEnglishForm name="hero.subtitle" label={t("hero.subtitle")} />
              <ArabicEnglishForm name="hero.description" label={t("hero.description")} area />

              <ArabicEnglishForm name="hero.buttonText" label={t("hero.buttonText")} />
              <FormInput name="hero.buttonLink" label={t("hero.buttonLink")} placeholder={t("hero.buttonLink")} />
            </div>
          </div>

          {/* About Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("about.title")}</h2>
            <div className="space-y-4">
              <ArabicEnglishForm name="about.title" label={common("title")} />
              <ArabicEnglishForm name="about.miniTitle" label={t("about.miniTitle")} />
              <ArabicEnglishForm name="about.description" label={t("about.description")} area />
              <FormInput name="about.link" label={t("about.link")} placeholder={t("about.link")} />
              <ArabicEnglishForm name="about.linkText" label={t("about.linkText")} />
              <FormInput
                name="about.mainImage"
                label={t("about.mainImage")}
                placeholder={t("about.mainImage")}
                photo
                single={true}
              />
            </div>
          </div>

          {/* About Services */}
          <div className="p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("aboutServices.title")}</h2>
              <Button
                type="button"
                onClick={() =>
                  appendAboutService({
                    title: { en: "", ar: "" },
                    miniTitle: { en: "", ar: "" },
                    description: { en: "", ar: "" },
                  })
                }
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("aboutServices.addService")}
              </Button>
            </div>
            <div className="space-y-4">
              {aboutServices.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">
                      {t("aboutServices.service")} {index + 1}
                    </h3>
                    <Button type="button" onClick={() => removeAboutService(index)} variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <ArabicEnglishForm name={`aboutServices.${index}.title`} label={common("title")} />
                    <ArabicEnglishForm name={`aboutServices.${index}.miniTitle`} label={t("aboutServices.miniTitle")} />
                    <ArabicEnglishForm
                      name={`aboutServices.${index}.description`}
                      label={t("aboutServices.description")}
                      area
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div className="p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("logos.title")}</h2>
              <Button
                type="button"
                onClick={() => appendLogo({ image: "", name: "" })}
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("logos.addLogo")}
              </Button>
            </div>
            <div className="space-y-4">
              {logos.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">
                      {t("logos.logo")} {index + 1}
                    </h3>
                    <Button type="button" onClick={() => removeLogo(index)} variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <FormInput name={`logos.${index}.name`} label={t("logos.name")} placeholder={t("logos.name")} />
                    <FormInput
                      name={`logos.${index}.image`}
                      label={t("logos.image")}
                      placeholder={t("logos.image")}
                      photo
                      single
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("services.title")}</h2>
              <Button
                type="button"
                onClick={() =>
                  appendService({
                    title: { en: "", ar: "" },
                    description: { en: "", ar: "" },
                    icon: "",
                    color: "#3B82F6",
                    link: "",
                    linkText: { en: "", ar: "" },
                  })
                }
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("services.addService")}
              </Button>
            </div>
            <div className="space-y-4">
              {services.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">
                      {t("services.service")} {index + 1}
                    </h3>
                    <Button type="button" onClick={() => removeService(index)} variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <ArabicEnglishForm name={`services.${index}.title`} label={common("title")} />
                    <ArabicEnglishForm name={`services.${index}.description`} label={t("services.description")} area />
                    <FormInput
                      name={`services.${index}.icon`}
                      label={t("services.icon")}
                      placeholder={t("services.icon")}
                      photo
                      single
                    />
                    <FormInput
                      name={`services.${index}.color`}
                      label={t("services.color")}
                      type="color"
                      placeholder="#3B82F6"
                      className="!w-[150px]"
                    />
                    <FormInput
                      name={`services.${index}.link`}
                      label={t("services.link")}
                      placeholder={t("services.link")}
                    />
                    <ArabicEnglishForm name={`services.${index}.linkText`} label={t("services.linkText")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            {/* Technologies */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <Button
                  type="button"
                  onClick={() => appendTechnology({ name: "", images: [] })}
                  className="inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("technologies.addTechnology")}
                </Button>
              </div>
              <div className="space-y-4">
                {technologies.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-md font-medium">
                        {t("technologies.technology")} {index + 1}
                      </h4>
                      <Button type="button" onClick={() => removeTechnology(index)} variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <FormInput
                        name={`technologies.${index}.name`}
                        label={t("technologies.name")}
                        placeholder={t("technologies.name")}
                      />
                      <FormInput
                        name={`technologies.${index}.images`}
                        label={t("technologies.images")}
                        placeholder={t("technologies.images")}
                        photo
                        single={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
