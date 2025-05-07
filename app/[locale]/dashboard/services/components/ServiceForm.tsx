"use client";

import React, { useEffect, useTransition } from "react";
import { useForm, FormProvider, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, ServiceFormValues } from "@/app/validations/service";
import FormInput from "@/app/components/inputs/FormInput";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { LoadingButton } from "@/app/components/ui/loading-button";

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
      title: "",
      descriptions: [{ title: "", description: "" }],
    },
  });

  // Setup field array for descriptions
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "descriptions",
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
  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editService") : t("createService")}</h1>
            <LoadingButton type="submit" isLoading={isPending}>
              {initialData ? common("update") : common("create")}
            </LoadingButton>
          </div>

          <Separator />

          {/* Service Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormInput name="icon" photo single label={t("form.icon")} placeholder={t("form.iconPlaceholder")} />
                  <FormInput name="title" label={t("form.title")} placeholder={t("form.titlePlaceholder")} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("form.descriptions")}</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: "", description: "" })}
                className="flex items-center gap-2"
                disabled={isPending}
              >
                <Plus className="h-4 w-4" />
                {t("form.addDescription")}
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="mb-4">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {t("form.descriptionItem")} {index + 1}
                    </h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive"
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormInput
                    name={`descriptions.${index}.title`}
                    label={t("form.descriptionTitle")}
                    placeholder={t("form.descriptionTitlePlaceholder")}
                  />
                  <FormInput
                    name={`descriptions.${index}.description`}
                    label={t("form.descriptionContent")}
                    placeholder={t("form.descriptionContentPlaceholder")}
                    area
                  />
                </CardContent>
              </Card>
            ))}
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
