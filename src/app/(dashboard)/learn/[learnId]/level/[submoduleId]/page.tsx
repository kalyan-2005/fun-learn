import { getQuestionsBySubmoduleId } from "@/actions/quizzes";
import React from "react";
import Quiz from "./Quiz";
import getCurrentUser from "@/actions/getCurrentUser";

const page = async ({ params }: { params: { submoduleId: string } }) => {
  const submodule = await getQuestionsBySubmoduleId(params.submoduleId);
  const currentUser = await getCurrentUser();
  return (
    <Quiz
      questions={submodule?.questions?.questions}
      currentUser={currentUser}
      params={{ submoduleId: params.submoduleId }}
    />
  );
};
export default page;