"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import FormInput from "@/app/components/inputs/FormInput";
import { PhotoInput } from "@/app/components/inputs/PhotoInput";
import { getSiteSettings, updateSiteSettings } from "@/app/actions/actions";
import { useTranslations } from "next-intl";

// Form schema validation
const formSchema = z.object({
  logo: z.string().min(1, "Logo is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const t = useTranslations("dashboard.common");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo: "",
      whatsapp: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const result = await getSiteSettings();

        if (result.success && result.data) {
          // Set form values from data
          methods.reset({
            logo: result.data.logo || "",
            whatsapp: result.data.whatsapp || "",
            phone: result.data.phone || "",
            email: result.data.email || "",
            address: result.data.address || "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load settings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [methods]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsSaving(true);
      const result = await updateSiteSettings(data);

      if (!result.success) {
        throw new Error(result.message || "Failed to update settings");
      }

      toast.success("Settings updated successfully");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MaxWidthWrapper className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <FormProvider {...methods}>
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Website Logo</CardTitle>
                  <CardDescription>Upload your website logo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <PhotoInput name="logo" single={true} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Update your contact information displayed on the website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      control={methods.control}
                      name="whatsapp"
                      label="WhatsApp Number"
                      placeholder="+1234567890"
                    />
                    <FormInput control={methods.control} name="phone" label="Phone Number" placeholder="+1234567890" />
                  </div>
                  <FormInput control={methods.control} name="email" label="Email" placeholder="contact@example.com" />
                  <FormInput
                    control={methods.control}
                    name="address"
                    label="Address"
                    placeholder="123 Street, City, Country"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      )}
    </MaxWidthWrapper>
  );
}
