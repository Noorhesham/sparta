import { getTranslations } from "next-intl/server";
import { userColumns, UserData } from "./columns";
import { Button } from "@/components/ui/button";
import ModelCustom from "@/app/components/ModelCustom";
import UserForm from "./components/UserForm";
import { DataTable } from "@/app/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
export const dynamic = "force-dynamic";

// Extend UserData to have an index signature to satisfy TableData constraint
interface ExtendedUserData extends UserData {
  [key: string]: unknown;
}

const UsersPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  const t = await getTranslations("dashboard.users");
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/api/users?page=${page}&limit=10`, {
    cache: "no-store",
  });

  const { success, data } = await res.json();

  if (!success || !data) {
    return <div>Failed to load users</div>;
  }

  const { data: users, pagination } = data;
  const { totalPages, page: currentPage } = pagination;

  // Format user data and remove sensitive info
  const formattedData: ExtendedUserData[] = users.map((user: Record<string, any>) => ({
    ...user,
    _id: user._id.toString(),
    password: undefined,
  }));

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
      <DataTable columns={typedColumns} data={formattedData} page={currentPage} totalPages={totalPages} entity="User" />
    </MaxWidthWrapper>
  );
};

export default UsersPage;
