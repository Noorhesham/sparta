import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Homepage from "@/models/Homepage";
import connectToDatabase from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Home } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

const HomepagePage = async ({ params }: { params: { locale: string } }) => {
  await connectToDatabase();
  const locale = params.locale;
  const t = await getTranslations({
    namespace: "dashboard.homepage",
    locale,
  });
  const common = await getTranslations({
    namespace: "dashboard.common",
    locale,
  });

  // Get only the first homepage entity
  const homepageData = await Homepage.findOne().sort({ createdAt: -1 }).lean();

  // Safely parse data
  const homepage = homepageData ? JSON.parse(JSON.stringify(homepageData)) : null;

  // Function to get content based on current locale
  const getLocalizedContent = (content: { en: string; ar: string }) => {
    if (!content) return "";
    return content[locale as "en" | "ar"] || content.en || "";
  };

  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
          {homepage ? (
            <Button asChild>
              <Link href={`/${locale}/dashboard/homepage/edit/${homepage._id}`}>
                <Edit className="mr-2 h-4 w-4" /> {common("edit")}
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/${locale}/dashboard/homepage/create`}>
                <Home className="mr-2 h-4 w-4" /> {t("create")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {!homepage ? (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground mb-4">{t("noContent")}</p>
          <Link href={`/${locale}/dashboard/homepage/create`}>
            <Button>{t("create")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Hero Section Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("form.hero.title")}</CardTitle>
              <CardDescription>{t("previewContent")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{common("content")}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{common("title")}:</span>
                      <p className="text-base">{getLocalizedContent(homepage.hero.title)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{t("form.hero.subtitle")}:</span>
                      <p className="text-base">{getLocalizedContent(homepage.hero.subtitle)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{t("form.hero.description")}:</span>
                      <p className="text-base line-clamp-3">{getLocalizedContent(homepage.hero.description)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-between">
              <div className="text-sm text-muted-foreground">
                {common("lastUpdated")}:{" "}
                {new Date(homepage.updatedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/dashboard/homepage/edit/${homepage._id}`}>
                  <Edit className="mr-2 h-4 w-4" /> {common("edit")}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* About Section Preview */}
          <Card>
            <CardHeader>
              <CardTitle>{t("form.about.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{common("content")}</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{common("title")}:</span>
                      <p className="text-base">{getLocalizedContent(homepage.about.title)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{t("form.about.miniTitle")}:</span>
                      <p className="text-base">{getLocalizedContent(homepage.about.miniTitle)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">{t("form.about.description")}:</span>
                      <p className="text-base line-clamp-3">{getLocalizedContent(homepage.about.description)}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t("form.about.mainImage")}</h3>
                  {homepage.about.mainImage && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                      <Image
                        src={homepage.about.mainImage}
                        alt={getLocalizedContent(homepage.about.title)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50">
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/dashboard/homepage/edit/${homepage._id}`}>
                  <Edit className="mr-2 h-4 w-4" /> {common("edit")}
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("summary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">{t("form.aboutServices.title")}</h3>
                  <p className="text-3xl font-bold mt-2">{homepage.aboutServices?.length || 0}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">{t("form.services.title")}</h3>
                  <p className="text-3xl font-bold mt-2">{homepage.services?.length || 0}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium">{t("form.technologies.title")}</h3>
                  <p className="text-3xl font-bold mt-2">{homepage.technologiesSection?.technologies?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default HomepagePage;
