import ContactUs from "@/models/ContactUs";
import connectToDatabase from "@/lib/mongodb";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const locale = await getLocale();
  const t = await getTranslations("dashboard.contact");
  const common = await getTranslations("dashboard.common");

  try {
    const contact = await ContactUs.findById(params.id).populate("service_id").lean();

    if (!contact) {
      return notFound();
    }

    // Convert MongoDB document to plain object and format
    const formattedContact = {
      ...JSON.parse(JSON.stringify(contact)),
      _id: contact._id.toString(),
      service_id: contact.service_id ? contact.service_id._id.toString() : "",
      serviceName: contact.service_id ? contact.service_id.title : "Unknown",
    };

    return (
      <MaxWidthWrapper className="flex flex-col mt-5 px-4">
        <div className="flex items-center justify-between">
          <Button asChild variant="outline">
            <Link href={`/${locale}/dashboard/contact`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {common("back")}
            </Link>
          </Button>
        </div>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            {formattedContact.first_name} {formattedContact.last_name}
          </h1>
          <p className="text-muted-foreground mt-2">{t("contactDetails")}</p>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("personalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">{t("fullName")}</div>
                <div className="font-medium">
                  {formattedContact.first_name} {formattedContact.last_name}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("email")}</div>
                <div className="font-medium">{formattedContact.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("phone")}</div>
                <div className="font-medium">{formattedContact.phone_number}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("serviceInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">{t("serviceName")}</div>
                <div className="font-medium">{formattedContact.serviceName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t("submittedOn")}</div>
                <div className="font-medium">{new Date(formattedContact.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error("Error fetching contact:", error);
    return notFound();
  }
}
