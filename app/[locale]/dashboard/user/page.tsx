import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";
import { getTranslations } from "next-intl/server";
import { userColumns } from "./columns";
import { Button } from "@/components/ui/button";
import ModelCustom from "@/app/components/ModelCustom";
import UserForm from "./components/UserForm";
import { DataTable } from "@/app/components/DataTable";
export const dynamic = "force-dynamic";

const UsersPage = async ({ searchParams }: { searchParams: { page?: string } }) => {
  await connectToDatabase();
  const t = await getTranslations("dashboard.users");

  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  const data = await User.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .lean();

  // Format user data and remove sensitive info
  const formattedData = data.map((user: any) => ({
    ...user,
    _id: user._id.toString(),
    password: undefined,
  }));

  const dataObj = JSON.parse(JSON.stringify(formattedData));
  const totalCount = await User.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <ModelCustom title={t("createUser")} btn={<Button>Add User</Button>} content={<UserForm />} />
      </div>
      <DataTable
        columns={userColumns}
        data={dataObj || []}
        page={currentPage}
        totalPages={totalPages}
        searchKey="name"
      />
    </MaxWidthWrapper>
  );
};

export default UsersPage;
