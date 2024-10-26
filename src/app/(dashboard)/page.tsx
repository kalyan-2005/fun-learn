import getCurrentUser from "@/actions/getCurrentUser";
import { getDashboardDetails } from "@/actions/quizzes";
import HomeClient from "@/components/home-client";
import Image from "next/image";
import React from "react";
import { IoGameController } from "react-icons/io5";

const page = async () => {
  const currentUser = await getCurrentUser();
  const dashboardData: any = await getDashboardDetails();
  const totalScore = dashboardData?.totalScore||"";
  const totalQuizzes = dashboardData?.totalQuizzes||"";
  return (
    <div>
      <div className="h-60 bg-gradient-to-r from-blue-500 to-purple-400 m-2 rounded-lg flex justify-between items">
        <div className="p-10">
          <h1 className="text-secondary-50 font-bold text-xl">
            Back to play {currentUser?.name} 👋
          </h1>
          <HomeClient />
        </div>
        <div className="pe-40">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/5346/5346469.png"
            alt=""
            height="200"
            width="100"
            className="absolute right-10 top-20"
          />
          <Image
            src="https://i.pinimg.com/originals/9d/29/22/9d292240e7ec3d3b3c9d11cefbd4b23a.png"
            alt=""
            height="200"
            width="100"
            className="absolute right-80 top-24 rotate-45"
          />
          <IoGameController className="-rotate-12 text-[150px] mt-12 text-violet-500/60" />
          <Image
            src="https://lordicon.com/icons/wired/gradient/1416-triangle.svg"
            alt=""
            height="200"
            width="100"
            className="absolute right-10 top-52 rotate-12"
          />
          <Image
            src="https://cdn0.iconfinder.com/data/icons/thin-line-color-2/21/22_1-512.png"
            alt=""
            height="200"
            width="100"
            className="absolute right-[340px] top-52 rotate-45"
          />
        </div>
      </div>
      <div className="flex mb-10 p-2 text-center gap-16 justify-center flex-wrap">
          <div className="w-[500px] rounded-md shadow-xl p-2 bg-secondary-50 text-secondary-900">
            <Image
              src="https://png.pngtree.com/png-clipart/20210312/original/pngtree-game-score-wood-sign-style-png-image_6072790.png"
              alt=""
              height={100}
              width={110}
              className="m-auto py-11"
            />
            <p className="text-primary-600 font-black pt-2 text-3xl">
            {totalScore}
            </p>
            <h1 className="p-1 text-sm font-bold">
              Total Score
            </h1>
          </div>
          <div className="w-[500px] rounded-md shadow-xl bg-secondary-50 text-secondary-900 p-2">
            <Image
              src="/home-quizzes.gif"
              alt=""
              height={200}
              width={200}
              className="m-auto"
            />
            <p className="text-primary-600 font-black pt-2 text-3xl">
              {totalQuizzes}
            </p>
            <h1 className="p-1 text-sm font-bold">
              Total Quizzes
            </h1>
          </div>
        </div>
      </div>
  );
};

export default page;
