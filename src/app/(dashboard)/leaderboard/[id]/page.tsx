import { leaderboard } from "@/actions/quizzes";
import Image from "next/image";

const Page = async ({ params }: { params: { id: string } }) => {
  const leaderboardData = await leaderboard(params.id);
  return (
    <div>
      {leaderboardData.map((user: any) => (
        <div
          key={user.id}
          className="flex p-2 px-4 justify-between items-center my-2 hover:bg-secondary-800 rounded-xl"
        >
          <div className="flex gap-4 items-center">
            <Image
              src={user.image || "/images/placeholder.jpg"}
              className="rounded-full"
              width={40}
              height={40}
              alt="profile"
            />
            <div>
              <h1 className="">{user.name}</h1>
              <h1 className="text-sm">@ {user.username}</h1>
            </div>
          </div>
          <div className="text-xl">{user.score}</div>
        </div>
      ))}
    </div>
  );
};

export default Page;
