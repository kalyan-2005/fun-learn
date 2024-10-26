"use client";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar";
import { RxAvatar, RxDashboard } from "react-icons/rx";
import { SiGooglegemini } from "react-icons/si";
import { FaShop } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { MdOutlineLeaderboard } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { Suspense, useState } from "react";
import Loading from "@/app/(dashboard)/loading";
import { User } from "@/types/user";

export default function HomeLayout({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User;
}) {
  const [menu, setMenu] = useState<boolean>(true);
  const items = [
    {
      name: "Dashboard",
      icon: <RxDashboard />,
      path: "/",
    },
    {
      name: "Learn",
      icon: <GiGraduateCap />,
      path: "/learn",
    },
    {
      name: "Practice",
      icon: <SiGooglegemini />,
      path: "/practice-ai",
    },
    {
      name: "Ask Doubt",
      icon: <MdOutlineLeaderboard />,
      path: "/ask-doubt",
    },
    // {
    //   name: "Shop",
    //   icon: <FaShop />,
    //   path: "/shop",
    // },
    // {
    //   name: "Avatar",
    //   icon: <RxAvatar />,
    //   path: "/avatar",
    // },
  ];
  return (
    <div className="w-full flex">
      <Sidebar items={items} menu={menu} setMenu={setMenu} currentUser={currentUser} />
      <div className={`w-full`}>
        <Navbar currentUser={currentUser} menu={menu} setMenu={setMenu} />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </div>
  );
}


