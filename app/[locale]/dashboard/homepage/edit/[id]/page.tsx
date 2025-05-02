import { HomepageForm } from "../../components/HomepageForm";
import { getEntity } from "@/app/actions/actions";
import { notFound } from "next/navigation";

export default async function EditHomepage({ params }: { params: { id: string } }) {
  try {
    // Fetch homepage data
    const result = await getEntity("Homepage", params.id);

    // Handle not found case
    if (!result.success || !result.data) {
      notFound();
    }

    // Sanitize the data to prevent circular references
    const sanitizedData = JSON.parse(JSON.stringify(result.data));

    return <HomepageForm initialData={sanitizedData} />;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    notFound();
  }
}
