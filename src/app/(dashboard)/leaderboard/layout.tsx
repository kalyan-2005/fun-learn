import { getAllQuizzes } from "@/actions/quizzes";
import Image from "next/image";

const page = async ({ children }: {
  children: React.ReactNode
}) => {
  const quizzes = await getAllQuizzes();
  return (
    <div className="w-3/4 mx-auto px-6">
      <div>
        <Image
          src="/3rd-place.png"
          className="block m-auto"
          width={180}
          height={180}
          alt="ratings"
        />
        <h1 className="text-2xl font-bold text-center pb-8 font-serif border-b mb-2 border-secondary-500">
          LEADERBAORD
        </h1>
      </div>
      <div className="flex flex-wrap py-4 gap-2">
        {quizzes.map((quiz) => (
          <h1 key={quiz.id}>
            <a className="p-1.5 px-3 rounded-xl border-2 hover:font-semibold hover:bg-blue-400 hover:border-blue-900 hover:text-blue-900" href={`/leaderboard/${quiz.id}`}>
              {quiz.category}
            </a>
          </h1>
        ))}
      </div>

      {children}
    </div>
  );
};

export default page;
