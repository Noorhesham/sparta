import { getTranslations } from "next-intl/server";
import { userColumns, UserData } from "./columns";
import { Button } from "@/components/ui/button";
import ModelCustom from "@/app/components/ModelCustom";
import UserForm from "./components/UserForm";
import { DataTable } from "@/app/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
export const dynamic = "force-dynamic";

// Extend UserData to have an index signature to satisfy TableData constraint
interface ExtendedUserData extends UserData {
  [key: string]: unknown;
}

const UsersPage = async ({ searchParams, params }: { searchParams: { page?: string }; params: { locale: string } }) => {
  await connectToDatabase();
  const locale = params.locale;
  const t = await getTranslations({
    namespace: "dashboard.team",
    locale,
  });

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await User.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  const dataObj = JSON.parse(JSON.stringify(data));
  const totalCount = await User.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);
  // Cast columns to the required type for DataTable
  const typedColumns = userColumns as ColumnDef<ExtendedUserData, unknown>[];

  const MaxWidthWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`max-w-screen-xl mx-auto w-full ${className || ""}`}>{children}</div>
  );

  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <ModelCustom title={t("createUser")} btn={<Button>Add User</Button>} content={<UserForm />} />
      </div>
      <DataTable columns={typedColumns} data={dataObj} page={currentPage} totalPages={totalPages} entity="User" />
    </MaxWidthWrapper>
  );
};

export default UsersPage;
