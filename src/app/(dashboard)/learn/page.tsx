import { getAllQuizzes } from "@/actions/quizzes";
import AddNewCourse from "@/components/AddNewCourse";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Learn() {
  const quizzes = await getAllQuizzes();
  return (
    <div className="px-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <AddNewCourse/>
      </div>
      <div className="flex flex-wrap gap-12 py-8">
        {quizzes.map((quiz) => (
          <Link
            href={`/learn/${quiz.id}`}
            key={quiz.id}
            className="rounded-2xl p-2  bg-gradient-to-r from-blue-500 to-blue-400 w-[300px]"
          >
            <div className="rounded-2xl overflow-hidden">
              {!quiz.image ? (
                <Image
                  src="/Supercoin.png"
                  className=" rounded-2xl hover:scale-110 duration-500 w-[300px] h-[200px] object-cover"
                  alt="html"
                  width={300}
                  height={200}
                />
              ) : (
                <Image
                  src={quiz.image as string}
                  className=" rounded-2xl hover:scale-110 duration-500 w-[300px] h-[200px] object-cover"
                  alt="html"
                  width={300}
                  height={200}
                />
              )}
            </div>
            <h1 className="text-xl font-semibold py-2 text-center">
              {quiz.category}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
}
