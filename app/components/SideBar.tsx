import React from "react";

const SideBar = ({ siteSettings }: { siteSettings: any }) => {
  return (
    <div className="lg:flex hidden z-[9990]  flex-col gap-3 fixed top-80 right-10">
      <a href={`https://wa.me/${siteSettings?.whatsapp}`}>
        <img className=" cursor-pointer" src={"/Group 626688.svg"} alt="" />
      </a>
    </div>
  );
};

export default SideBar;
