"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MailIcon, LockIcon } from "lucide-react";
import FormInput from "@/app/components/inputs/FormInput";

interface LoginFormValues {
  email: string;
  password: string;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error(t("loginFailed"));
        setIsLoading(false);
        return;
      }

      toast.success(t("loginSuccess"));
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-primary">{t("appName")}</h1>
          </div>
          <CardTitle className="text-2xl font-bold text-center">{t("login")}</CardTitle>
          <CardDescription className="text-center">{t("enterCredentials")}</CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
              <FormInput
                name="email"
                label={t("email")}
                placeholder={t("emailPlaceholder")}
                type="text"
                icon={<MailIcon className="w-4 h-4" />}
              />
              <FormInput
                name="password"
                label={t("password")}
                placeholder={t("passwordPlaceholder")}
                type="password"
                password={true}
                icon={<LockIcon className="w-4 h-4" />}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("processing") : t("signIn")}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
