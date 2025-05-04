"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createUser, updateUser } from "@/app/actions/actions";

interface UserFormProps {
  initialData?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: "user" | "admin";
    isVerified?: boolean;
  };
  isEdit?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["user", "admin"]),
  isVerified: z.boolean().default(false),
});

export type UserFormValues = z.infer<typeof formSchema>;

export const UserForm: React.FC<UserFormProps> = ({ initialData, isEdit = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("dashboard");

  const defaultValues: Partial<UserFormValues> = {
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    role: initialData?.role || "user",
    isVerified: initialData?.isVerified || false,
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsLoading(true);

      let response;
      if (isEdit && initialData?._id) {
        // For edit, exclude password if empty
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        response = await updateUser(initialData._id, updateData);
      } else {
        // For create, ensure password is provided
        if (!data.password) {
          toast.error(t("common.error"));
          form.setError("password", { message: "Password is required for new users" });
          setIsLoading(false);
          return;
        }
        response = await createUser(data);
      }

      if (response.success) {
        toast.success(isEdit ? t("users.updateSuccess") : t("users.createSuccess"));
        router.refresh();
        router.push("/dashboard/user");
      } else {
        toast.error(response.message || t("common.error"));
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("users.form.mainInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users.form.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("users.form.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users.form.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("users.form.emailPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("users.form.password")}
                    {isEdit && (
                      <span className="text-xs text-gray-500 ml-2">(Leave empty to keep current password)</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("users.form.passwordPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("users.form.phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("users.form.phonePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("users.form.role")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">{t("users.form.userRoles.user")}</SelectItem>
                        <SelectItem value="admin">{t("users.form.userRoles.admin")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("users.form.address")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("users.form.addressPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("users.form.isVerified")}</FormLabel>
                    <FormDescription>Mark the user as verified</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" disabled={isLoading} onClick={() => router.push("/dashboard/user")}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : isEdit ? t("common.update") : t("common.create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
