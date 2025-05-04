import TeamMember from "@/models/TeamMember";
import { notFound } from "next/navigation";
import { TeamMemberForm } from "../../components/TeamMemberForm";
import connectToDatabase from "@/lib/mongodb";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditTeamMemberPage({ params }: PageProps) {
  const { id } = params;

  await connectToDatabase();
  const teamMember = await TeamMember.findById(id).lean();

  if (!teamMember) {
    notFound();
  }

  // Convert Mongoose document to plain object
  const teamMemberObj = JSON.parse(JSON.stringify(teamMember));

  // Add the id as a string
  teamMemberObj._id = id;

  return <TeamMemberForm initialData={teamMemberObj} />;
}
