"use client";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const words = ["Play", "Learn", "Excel"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [forward, setForward] = useState(true);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && forward) {
      setForward(false);
      return;
    }
    if (subIndex === 0 && !forward) {
      setForward(true);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (forward ? 1 : -1));
      },
      forward ? 150 : 100
    );
    return () => clearTimeout(timeout);
  }, [subIndex, forward, index, words]);

  useEffect(() => {
    const blinkTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(blinkTimeout);
  }, [blink]);
  return (
      <div>
        <div className="text-4xl font-semibold mt-4">
          <span className="inline-block text-transparent text-4xl bg-clip-text font-black bg-gradient-to-l from-purple-600 to-pink-500">
            {`${words[index].substring(0, subIndex)}`}
          </span><br />
          <h1 className="text-3xl mt-2">where interaction meets education.</h1>
        </div>
      </div>
  );
}
