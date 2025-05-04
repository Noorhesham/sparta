"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
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

interface ServiceFormProps {
  initialData?: ServiceFormValues;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.services");
  const common = useTranslations("dashboard.common");

  // Initialize form with default values or initial data
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      icon: "",
      title: "",
      description: "",
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
  const onSubmit: SubmitHandler<ServiceFormValues> = async (data) => {
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
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editService") : t("createService")}</h1>
            <Button type="submit">{initialData ? common("update") : common("create")}</Button>
          </div>

          <Separator />

          {/* Service Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormInput name="icon" photo label={t("form.icon")} placeholder={t("form.iconPlaceholder")} />
                  <FormInput name="title" label={t("form.title")} placeholder={t("form.titlePlaceholder")} />
                  <FormInput
                    name="description"
                    label={t("form.description")}
                    placeholder={t("form.descriptionPlaceholder")}
                    area
                  />
                </CardContent>
              </Card>
            </div>
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
