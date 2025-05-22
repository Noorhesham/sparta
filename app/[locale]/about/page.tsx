import React from "react";
import About from "@/app/components/home/About";
import connectToDatabase from "@/lib/mongodb";
import Homepage from "@/models/Homepage";
import Team from "@/app/components/home/Team";
import TeamMember from "@/models/TeamMember";
import VisionMission from "@/app/components/home/VisionMission";
const AboutUs = async ({ params }: { params: { locale: string } }) => {
  await connectToDatabase();

  // Cast to any to bypass TypeScript errors with Mongoose
  const homepageModel = Homepage as any;
  const homepageData = await homepageModel.findOne({}).lean();
  const teamModel = TeamMember as any;
  const teamData = await teamModel.find({}).sort({ createdAt: -1 }).lean();
  const locale = params.locale;

  return (
    <div>
      <About data={homepageData?.about} locale={locale} />
      <VisionMission data={homepageData?.visionMission} locale={locale} />
      <Team data={teamData} locale={locale} />
    </div>
  );
};

export default AboutUs;
