"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamMemberSchema, TeamMemberFormValues } from "@/app/validations/team";
import FormInput from "@/app/components/inputs/FormInput";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberFormProps {
  initialData?: TeamMemberFormValues;
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard.team");
  const common = useTranslations("dashboard.common");

  // Initialize form with default values or initial data
  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: initialData || {
      name: "",
      job_title: "",
      image: "",
      Facebook_link: "",
      instagram_link: "",
      x_link: "",
      linkedin: "",
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
  const onSubmit: SubmitHandler<TeamMemberFormValues> = async (data) => {
    try {
      // Create a clean copy of the data to avoid circular references
      const cleanData = JSON.parse(JSON.stringify(data));

      // Remove empty or undefined values
      if (cleanData._id === "") {
        delete cleanData._id;
      }

      // Create or update entity
      const res = initialData
        ? await updateEntity("TeamMember", initialData._id as string, cleanData)
        : await createEntity("TeamMember", cleanData);

      if (res.success) {
        toast.success(initialData ? t("updateSuccess") : t("createSuccess"));
        router.push(`/${locale}/dashboard/team`);
      } else {
        toast.error(res.message || t("error"));
      }
    } catch (error) {
      console.error("Team member form error:", error);
      toast.error(t("error"));
    }
  };

  return (
    <MaxWidthWrapper>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{initialData ? t("editTeamMember") : t("createTeamMember")}</h1>
            <Button type="submit">{initialData ? common("update") : common("create")}</Button>
          </div>

          <Separator />

          {/* Team Member Information */}
          <div className="p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">{t("form.mainInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormInput name="name" label={t("form.name")} placeholder={t("form.namePlaceholder")} />
                <FormInput name="job_title" label={t("form.job_title")} placeholder={t("form.jobTitlePlaceholder")} />
                <FormInput name="image" label={t("form.image")} placeholder={t("form.imagePlaceholder")} photo single />
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">{t("form.socialLinksTitle")}</h3>
                  <div className="space-y-4">
                    <FormInput name="Facebook_link" label={t("form.Facebook_link")} />
                    <FormInput name="instagram_link" label={t("form.instagram_link")} />
                    <FormInput name="x_link" label={t("form.x_link")} />
                    <FormInput name="linkedin" label={t("form.linkedin")} />
                  </div>
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
