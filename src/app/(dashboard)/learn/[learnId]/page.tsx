import { getModulesbyQuizId } from "@/actions/quizzes";
import Path from "@/components/path";
import { div } from "@tensorflow/tfjs";
import React from "react";

const page = async ({ params }: { params: { learnId: string } }) => {
  const { modules, currentLevel }: any = await getModulesbyQuizId(
    params.learnId
  );
  return (
      <div className="w-[700px] mx-auto">
        {modules.map((module: any, index: number) => (
          <div key={module.id}>
            <div>
              <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-400 border-b-4 border-l-4 text-primary-200 border-indigo-400 flex justify-between items-center p-4">
                <div>
                  <h1 className="text-2xl font-semibold">{module.title}</h1>
                  <h1>{module.description||"Description"}</h1>
                </div>
                <div>
                  <button className="p-2 px-4 rounded-lg border border-b-4 border-l-4 border-indigo-400 bg-blue-500 hover:bg-violet-400 hover:scale-105 duration-500">
                    Continue
                  </button>
                </div>
              </div>
              <div className="">
                <Path
                  buttons={module.submodules}
                  lastUnlockedIndex={currentLevel}
                  params={params}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};
export default page;