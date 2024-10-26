import getCurrentUser from "@/actions/getCurrentUser";
import HomeClient from "@/components/home-client";
import Image from "next/image";
import React from "react";
import { IoGameController } from "react-icons/io5";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div>
      {/* Header Section */}
      <div className="h-60 bg-gradient-to-r from-blue-500 to-purple-400 m-2 rounded-lg flex justify-between items-center">
        <div className="p-10">
          <h1 className="text-secondary-50 font-bold text-xl">
            Back to play {currentUser?.name} 👋
          </h1>
          <HomeClient />
        </div>
        <div className="pe-40 relative">
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
          <IoGameController className="-rotate-12 text-[150px] mb-20 text-violet-500/60" />
          <Image
            src="https://cdn-icons-png.flaticon.com/512/742/742751.png"
            alt=""
            height="200"
            width="100"
            className="absolute right-[200px] top-36 rotate-45"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 p-4">
        {/* Feature 1: Gen AI Teacher */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4250/4250512.png"
            alt="Gen AI Teacher"
            width="100"
            height="100"
            className="mx-auto mb-4"
          />
          <h2 className="text-lg font-bold text-blue-500">Gen AI Teacher</h2>
          <p className="text-sm mt-2 text-gray-600">
            A virtual AI teacher providing personalized lessons and learning insights.
          </p>
        </div>

        {/* Feature 2: Gen AI Doubt Solving Assistant */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/1973/1973747.png"
            alt="Gen AI Doubt Solving Assistant"
            width="100"
            height="100"
            className="mx-auto mb-4"
          />
          <h2 className="text-lg font-bold text-blue-500">Gen AI Doubt Solving Assistant</h2>
          <p className="text-sm mt-2 text-gray-600">
            An AI assistant available 24/7 to clarify doubts on any subject with real-time answers.
          </p>
        </div>

        {/* Feature 3: Quiz Generator */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/3698/3698153.png"
            alt="Quiz Generator"
            width="100"
            height="100"
            className="mx-auto mb-4"
          />
          <h2 className="text-lg font-bold text-blue-500">Quiz Generator</h2>
          <p className="text-sm mt-2 text-gray-600">
            Generate engaging quizzes with ease and test your knowledge on various topics.
          </p>
        </div>

      </div>
    </div>
  );
};

export default page;
