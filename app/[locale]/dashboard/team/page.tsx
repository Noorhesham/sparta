import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import TeamMember from "@/models/TeamMember";
import connectToDatabase from "@/lib/mongodb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { DataTable } from "@/app/components/DataTable";
import { teamMemberColumns } from "./columns";

export const dynamic = "force-dynamic";

const TeamMembersPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  await connectToDatabase();
  const locale = await getLocale();
  const t = await getTranslations("dashboard.team");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await TeamMember.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await TeamMember.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <Button className="self-end">
          <Link href={`/${locale}/dashboard/team/create`}>{t("addTeamMember")}</Link>
        </Button>
      </div>
      <DataTable
        columns={teamMemberColumns}
        data={dataObj}
        page={currentPage}
        totalPages={totalPages}
        entity="TeamMember"
      />
    </MaxWidthWrapper>
  );
};

export default TeamMembersPage;
