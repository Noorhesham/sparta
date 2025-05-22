"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import FormInput from "@/app/components/inputs/FormInput";
import MaxWidthWrapper from "../defaults/MaxWidthWrapper";
import MotionItem from "../defaults/MotionItem";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { submitContactForm, getServices, getSiteSettings } from "@/app/actions/actions";
import { useTranslations } from "next-intl";

// Contact form schema with validation
const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  service_id: z.string().min(1, "Please select a service"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface Service {
  _id: string;
  title:
    | string
    | {
        en: string;
        ar: string;
      };
  icon?: string;
  description?: string;
  descriptions?: Array<{
    locale: string;
    content: string;
  }>;
}

interface ContactFormProps {
  locale?: string;
}

const ContactForm = ({ locale = "en" }: ContactFormProps) => {
  const t = useTranslations("form.contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    phone: "+1012 3456 789",
    email: "demo@gmail.com",
    address: "132 Dartmouth Street Boston, Massachusetts 02156 United States",
    whatsapp: "",
  });

  // Fetch services and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch services
        const servicesResult = await getServices();
        if (servicesResult.success && servicesResult.data) {
          setServices(servicesResult.data);
        } else {
          setServices([]);
        }

        // Fetch settings
        const settingsResult = await getSiteSettings();
        console.log(settingsResult);
        if (settingsResult.success && settingsResult.data) {
          setSettings({
            phone: settingsResult.data.phone || settings.phone,
            email: settingsResult.data.email || settings.email,
            address: settingsResult.data.address || settings.address,
            whatsapp: settingsResult.data.whatsapp || settings.whatsapp,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Could not load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      service_id: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      setIsSubmitting(true);

      // Submit using server action
      const result = await submitContactForm(data);

      if (!result.success) {
        throw new Error(result.message || "Something went wrong");
      }

      toast.success(result.message || "Your message has been sent successfully!");
      form.reset();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{
        backgroundColor: "#0F172A",
        backgroundImage: "url('/GradientMesh_Light.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=""
    >
      <MaxWidthWrapper>
        <div className="flex bg-white rounded-xl  flex-col md:flex-row gap-8 md:gap-16">
          {/* Contact Information - Dark Background */}
          <MotionItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#1D1D3B] rounded-xl text-white p-10 md:w-1/3 flex flex-col"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("contactInfo")}</h2>
            <p className="text-gray-300 mb-10">{t("contactSubheading")}</p>

            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <a href={`tel:${settings.phone}`} className="hover:underline">
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {settings.address}
                </a>
              </div>

              {settings.whatsapp && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/10 p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {settings.whatsapp}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </MotionItem>

          {/* Contact Form */}
          <MotionItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:w-2/3 p-3 py-5 text-black "
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    control={form.control}
                    name="first_name"
                    label={t("firstName")}
                    placeholder={t("firstName")}
                  />

                  <FormInput
                    control={form.control}
                    name="last_name"
                    label={t("lastName")}
                    placeholder={t("lastName")}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    control={form.control}
                    name="email"
                    label={t("email")}
                    placeholder={t("email")}
                    type="email"
                  />

                  <FormInput
                    control={form.control}
                    name="phone_number"
                    label={t("phoneNumber")}
                    placeholder="+1 012 3456 78"
                  />
                </div>

                <div>
                  <label className="block mb-2 uppercase text-sm font-medium">{t("chooseService")}</label>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">{t("loadingServices")}</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {services.length > 0 ? (
                        services.map((service) => (
                          <div key={service._id} className="flex items-center">
                            <input
                              type="radio"
                              id={service._id}
                              value={service._id}
                              className="w-4 h-4 accent-purple-600 cursor-pointer"
                              {...form.register("service_id")}
                            />
                            <label
                              htmlFor={service._id}
                              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer truncate"
                            >
                              {typeof service?.title === "string"
                                ? service?.title
                                : service?.title?.[locale] || service?.title?.en}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 col-span-3">{t("noServices")}</p>
                      )}
                    </div>
                  )}

                  {form.formState.errors.service_id && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.service_id.message}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 uppercase text-sm font-medium">{t("message")}</label>
                  <textarea
                    placeholder={t("writeMessage")}
                    rows={4}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    {...form.register("message")}
                  ></textarea>
                  {form.formState.errors.message && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.message.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("sending")}
                      </>
                    ) : (
                      t("sendMessage")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </MotionItem>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default ContactForm;
