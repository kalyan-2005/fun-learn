"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, BookOpen, Trophy, Clock } from "lucide-react";
import useSuperCoinsStore from "@/hooks/useSuperCoinsStore";
import useHeartsStore from "@/hooks/useHeartsStore";
import Image from "next/image";
import Quiz from "../learn/[learnId]/level/[submoduleId]/Quiz";

const AiQuiz = ({ currentUser }: { currentUser: any }) => {
  const [topic, setTopic] = useState("");
  const [nQuestions, setNQuestions] = useState(1);
  const [difficulty, setDifficulty] = useState("easy");
  const [response, setResponse] = useState([]);
  const [text, setText] = useState("Generate");
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const { superCoins, setSuperCoins } = useSuperCoinsStore();
  const { hearts, setHearts } = useHeartsStore();

  useEffect(() => {
    setHearts(currentUser?.hearts);
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
    if (currentUser?.supercoins > 0 && hearts >= nQuestions) {
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
      if (superCoins <= 0)
        toast.error("You don&apos;t have enough supercoins 🪙!");
      if (hearts < nQuestions) toast.error("You don't have enough hearts ❤️!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {showQuiz ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            Assessment: {topic}
          </h2>
          <Quiz questions={response} currentUser={currentUser} />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-400">
              Skill Assessment
            </h1>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                htmlFor="skill"
              >
                Skill to Assess
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                id="skill"
                type="text"
                value={topic}
                disabled={loading || superCoins === 0}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter skill (e.g., JavaScript, Python)"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                htmlFor="duration"
              >
                No of Questions
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                id="duration"
                type="number"
                min="2"
                max="20"
                value={nQuestions}
                disabled={loading || superCoins === 0}
                onChange={(e) => setNQuestions(parseInt(e.target.value))}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                htmlFor="level"
              >
                Difficulty Level
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600"
                id="level"
                value={difficulty}
                disabled={loading || superCoins === 0}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                className={`flex items-center justify-center w-full sm:w-auto text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out ${
                  superCoins === 0 || loading
                    ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400 opacity-50"
                    : "bg-purple-500 hover:bg-purple-600"
                }`}
                type="button"
                disabled={loading || superCoins === 0}
                onClick={handleGenerate}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BookOpen className="mr-2 h-4 w-4" />
                )}
                {loading ? "Generating..." : "Start Assessment"}
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center justify-center">
            <Image
              src="/ai-learning.gif"
              alt="Skill Assessment"
              className="w-2/3 mb-8"
              width={100}
              height={100}
            />
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
                <Trophy className="h-8 w-8 text-purple-500 dark:text-purple-400 mr-2" />
                <div>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                    Earn Badges
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Showcase your skills
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 rounded-lg p-4">
                <Clock className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mr-2" />
                <div>
                  <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    Timed Challenges
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">
                    Test your speed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiQuiz;

// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Quiz from "../learn/[learnId]/level/[submoduleId]/Quiz";
// import useSuperCoinsStore from "@/hooks/useSuperCoinsStore";
// import useHeartsStore from "@/hooks/useHeartsStore";

// const AiQuiz = ({ currentUser }: { currentUser: any }) => {
//   const [topic, setTopic] = useState("");
//   const [nQuestions, setNQuestions] = useState(1);
//   const [difficulty, setDifficulty] = useState("easy");
//   const [response, setResponse] = useState([]);
//   const [text, setText] = useState("Generate");
//   const [loading, setLoading] = useState(false);
//   const [showQuiz, setShowQuiz] = useState(false);
//   const { superCoins, setSuperCoins } = useSuperCoinsStore();
//   const {hearts,setHearts} = useHeartsStore();

//   useEffect(() => {
//     setHearts(currentUser?.hearts)
//     setSuperCoins(currentUser?.supercoins);
//   }, []);

//   const handleSuperCoins = async (id: string) => {
//     try {
//       const response = await axios.post("/api/superCoins/use", { id });
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleGenerate = async () => {
//     if (currentUser?.supercoins > 0 && hearts>=nQuestions)  {
//       try {
//         setLoading(true);
//         setText("Generating...");

//         const response = await axios.post("/api/gemini-api", {
//           topic,
//           nQuestions,
//           difficulty,
//         });

//         await handleSuperCoins(currentUser.id);
//         setSuperCoins(superCoins - 1);
//         const res = await response.data;
//         const validate = res.payload
//           .replace(/^```jsonn?/, "")
//           .replace(/```$/, "");
//         const msg = JSON.parse(validate);
//         setResponse(msg);
//         setLoading(false);
//         setText("Generate");
//         toast.success("Questions generated successfully");
//         setShowQuiz(true);
//       } catch (error) {
//         console.error("Error:", error);
//         setLoading(false);
//         setText("Generate");
//         toast.error("Error generating questions");
//       }
//     } else {
//       if(superCoins<=0)
//       toast.error("You don&apos;t have enough supercoins 🪙!");
//       if(hearts<nQuestions)
//       toast.error("You don't have enough hearts ❤️!");
//     }
//   };

//   return (
//     <div>
//       {showQuiz ? (
//         <Quiz questions={response} currentUser={currentUser} />
//       ) : (
//         <div className="flex h-fit gap-16 mt-16 mx-16 ">
//           <div className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-lg p-8">
//             <div className="mb-4">
//               <label
//                 className="block text-white font-bold mb-2 "
//                 htmlFor="topic"
//               >
//                 Topic
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out  placeholder:text-gray-800 dark:placeholder:text-white"
//                 id="topic"
//                 type="text"
//                 value={topic}
//                 disabled={loading || superCoins === 0}
//                 onChange={(e) => setTopic(e.target.value)}
//                 placeholder="Enter topic"
//               />
//             </div>
//             <div className="mb-4">
//               <label
//                 className="block text-white font-bold mb-2"
//                 htmlFor="nQuestions"
//               >
//                 Number of questions
//               </label>
//               <input
//                 className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
//                 id="nQuestions"
//                 min = "1"
//                 type="number"
//                 value={nQuestions}
//                 disabled={loading || superCoins === 0}
//                 onChange={(e) => setNQuestions(parseInt(e.target.value))}
//                 placeholder="Enter number of questions"
//               />
//             </div>
//             <div className="mb-6">
//               <label
//                 className="block text-white font-bold mb-2"
//                 htmlFor="difficulty"
//               >
//                 Difficulty
//               </label>
//               <select
//                 className="shadow dark:bg-[#121212] appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
//                 id="difficulty"
//                 value={difficulty}
//                 disabled={loading || superCoins === 0}
//                 onChange={(e) => setDifficulty(e.target.value)}
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//             <div className=" flex items-center justify-start">
//               <button
//                 className={` text-purple-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out ${
//                   superCoins === 0 ?
//                   "bg-gray-400 cursor-not-allowed hover:bg-gray-400 text-gray-900 opacity-85 mr-4" : "bg-white hover:bg-gray-200"
//                 } `}
//                 type="button"
//                 disabled={loading || superCoins === 0}
//                 onClick={handleGenerate}
//               >
//                 {text}
//               </button>
//               {superCoins === 0 && (
//                 <p className="text-red-600 text-base mt-2 font-semibold">
//                   (You don&apos;t have enough supercoins!)
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="w-1/2 flex bg-white items-center justify-center rounded-lg shadow-lg p-8">
//             <img src="/ai-learning.gif" alt="AI" className="w-1/2" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AiQuiz;
