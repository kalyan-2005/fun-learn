"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Quiz from "../learn/[learnId]/level/[submoduleId]/Quiz";
import useSuperCoinsStore from "@/hooks/useSuperCoinsStore";
import useHeartsStore from "@/hooks/useHeartsStore";

const AiQuiz = ({ currentUser }: { currentUser: any }) => {
  const [topic, setTopic] = useState("");
  const [nQuestions, setNQuestions] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");
  const [response, setResponse] = useState([]);
  const [text, setText] = useState("Generate");
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const { superCoins, setSuperCoins } = useSuperCoinsStore();
  const {hearts,setHearts} = useHeartsStore();

  useEffect(() => {
    setHearts(currentUser?.hearts)
    setSuperCoins(currentUser?.supercoins);
  }, []);

  const handleSuperCoins = async (id: string) => {
    try {
      const response = await axios.post("/api/superCoins/use", { id });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGenerate = async () => {
    if (currentUser?.supercoins > 0 && hearts>=nQuestions)  {
      try {
        setLoading(true);
        setText("Generating...");

        const response = await axios.post("/api/gemini-api", {
          topic,
          nQuestions,
          difficulty,
        });

        await handleSuperCoins(currentUser.id);
        setSuperCoins(superCoins - 1);
        const res = await response.data;
        const validate = res.payload
          .replace(/^```jsonn?/, "")
          .replace(/```$/, "");
        const msg = JSON.parse(validate);
        setResponse(msg);
        setLoading(false);
        setText("Generate");
        toast.success("Questions generated successfully");
        setShowQuiz(true);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
        setText("Generate");
        toast.error("Error generating questions");
      }
    } else {
      if(superCoins<=0)
      toast.error("You don&apos;t have enough supercoins 🪙!");
      if(hearts<nQuestions)
      toast.error("You don't have enough hearts ❤️!");
    }
  };

  return (
    <div>
      {showQuiz ? (
        <Quiz questions={response} currentUser={currentUser} />
      ) : (
        <div className="flex h-fit gap-16 mt-16 mx-16 ">
          <div className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg p-8">
            <div className="mb-4">
              <label
                className="block text-white font-bold mb-2 "
                htmlFor="topic"
              >
                Topic
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out  placeholder:text-gray-800 dark:placeholder:text-white"
                id="topic"
                type="text"
                value={topic}
                disabled={loading || superCoins === 0}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-white font-bold mb-2"
                htmlFor="nQuestions"
              >
                Number of questions
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
                id="nQuestions"
                min = "1"
                type="number"
                value={nQuestions}
                disabled={loading || superCoins === 0}
                onChange={(e) => setNQuestions(parseInt(e.target.value))}
                placeholder="Enter number of questions"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-white font-bold mb-2"
                htmlFor="difficulty"
              >
                Difficulty
              </label>
              <select
                className="shadow dark:bg-[#121212] appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
                id="difficulty"
                value={difficulty}
                disabled={loading || superCoins === 0}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className=" flex items-center justify-start">
              <button
                className={` text-purple-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out ${
                  superCoins === 0 ?
                  "bg-gray-400 cursor-not-allowed hover:bg-gray-400 text-gray-900 opacity-85 mr-4" : "bg-white hover:bg-gray-200"
                } `}
                type="button"
                disabled={loading || superCoins === 0}
                onClick={handleGenerate}
              >
                {text}
              </button>
              {superCoins === 0 && (
                <p className="text-red-600 text-base mt-2 font-semibold">
                  (You don&apos;t have enough supercoins!)
                </p>
              )}
            </div>
          </div>
          <div className="w-1/2 flex bg-white items-center justify-center rounded-lg shadow-lg p-8">
            <img src="/ai-learning.gif" alt="AI" className="w-1/2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AiQuiz;
