import { getAllQuizzes } from "@/actions/quizzes";
import { div } from "@tensorflow/tfjs";
import Image from "next/image";

const page = async () => {
  const quizzes = await getAllQuizzes();
  return (
    <div>Select</div>
  );
};

export default page;
