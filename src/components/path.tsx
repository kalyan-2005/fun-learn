"use client";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import cn from "classnames";
import Link from "next/link";
import "react-circular-progressbar/dist/styles.css";
import { FaRankingStar } from "react-icons/fa6";
import { HiTrophy } from "react-icons/hi2";
import { FaStar } from "react-icons/fa";
import { IoStarSharp } from "react-icons/io5";
import Image from "next/image";
import useAvatarStore from "@/hooks/useAvatarStore";

const Path = ({
  buttons,
  lastUnlockedIndex,
  params,
}: {
  buttons: any;
  lastUnlockedIndex: number;
  params: any;
}) => {
  const { avatar } = useAvatarStore()
  const generateCurvedPath = (
    startX: any,
    startY: any,
    endX: any,
    endY: any
  ) => {
    const controlX1 = startX + (endX - startX) / 2;
    const controlY1 = startY - 50;
    const controlX2 = startX + (endX - startX) / 2;
    const controlY2 = endY + 50;
    return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
  };

  return (
    <div
      className={`relative flex flex-col my-20 items-center gap-20 ${
        buttons.length !== 0 && "mb-40"
      }`}
    >
      {buttons.length === 0 && <div className="">No modules found!</div>}
      {buttons.map((button: any) => {
        const index = button.level - 1;
        const starcount = button.score[0]?.score / 10;
        return (
          <div
            key={button.id}
            className="relative flex flex-col items-center"
            style={{ marginLeft: index % 2 === 0 ? "140px" : "-140px" }}
          >
            {
              starcount>0&&
              <div className="absolute top-[-30px] flex gap-1">
                {
                Array.from({ length: starcount }, (_, i) => (
                  <FaStar key={i} className="h-5 w-5 text-yellow-500" />
                ))}
              </div>
            }
            {index >= 0 && (
              <svg
                className="absolute top-7 left-1/2 transform -translate-x-1/2"
                width="200"
                height="200"
              >
                <path
                  d={generateCurvedPath(100, 0, 100, 200)}
                  stroke="gray"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            )}
            <Link
              href={`${params.learnId}/level/${button.id}`}
              aria-disabled={button.locked}
              style={{
                pointerEvents:
                  buttons.level >= lastUnlockedIndex ? "none" : "auto",
              }}
            >
              <div className="relative">
                <div className="h-[102px] w-[102px] relative">
                  <div className="absolute -top-14 left-2.5 rounded-xl tracking-wide z-10">
                    
                  </div>
                  {index === lastUnlockedIndex - 1 &&
                    (index >= lastUnlockedIndex ? (
                      <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-red-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
                        Locked
                        <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
                      </div>
                    ) : (
                      <div className="absolute -top-6 left-2.5 px-3 py-2.5 border-2 font-bold uppercase text-green-500 bg-white rounded-xl animate-bounce tracking-wide z-10">
                        Unlocked
                        <div className="absolute left-1/2 -bottom-2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-x-1/2" />
                      </div>
                    ))}
                  <CircularProgressbarWithChildren
                    value={50}
                    styles={{
                      path: {
                        stroke:
                          index >= lastUnlockedIndex ? "#f44336" : "#4caf50",
                      },
                      trail: {
                        stroke: "#e5e7eb",
                      },
                    }}
                  >
                    <button
                      className={cn(
                        "h-[70px] hover:h-[80px] hover:w-[80px] w-[70px] rounded-full flex justify-center items-center",
                        index >= lastUnlockedIndex
                          ? "bg-red-500"
                          : "bg-green-500"
                      )}
                      disabled={index >= lastUnlockedIndex}
                    >
                      <HiTrophy className="h-8 w-8" />
                    </button>
                  </CircularProgressbarWithChildren>
                  {index === lastUnlockedIndex - 1 && (
                    <Image
                      width={80}
                      height={80}
                      src= {avatar || "/avatar.png"}
                      alt=""
                      className="ml-10 mt-10"
                    />
                  )}
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Path;
