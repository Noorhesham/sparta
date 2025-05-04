import { ServiceForm } from "../components/ServiceForm";
import { getTranslations } from "next-intl/server";

export default async function CreateServicePage() {
  const t = await getTranslations("dashboard.services");

  return <ServiceForm />;
}
