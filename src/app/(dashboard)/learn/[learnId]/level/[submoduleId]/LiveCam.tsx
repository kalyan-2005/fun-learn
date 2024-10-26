"use client";
import React, { useRef, useState, useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { drawHand } from "./utils";

function LiveCam({
  lockCount,
  setLockCount,
  loading,
  setLoading,
}) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const timerRef = useRef(null); // Ref for the timer interval

  const [fingerCount, setFingerCount] = useState(0);
  const [mirror, setMirror] = useState(true);
  const [isCountLocked, setIsCountLocked] = useState(false);
  const [prevCounts, setPrevCounts] = useState([]);

  const runHandpose = async () => {
    setLoading(true);
    await tf.setBackend("webgl");
    const net = await handpose.load();
    setLoading(false);
    setInterval(() => {
      detect(net);
    }, 200);
  };

  const detect = async (net) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const hand = await net.estimateHands(video);

      if (hand.length > 0) {
        const count = countFingers(hand[0].landmarks);
        updateFingerCount(count);
      } else {
        // Reset count and timer if no hand detected
        setFingerCount(0);
        resetLockTimer();
      }

      const ctx = canvasRef.current.getContext("2d");

      // Conditionally flip the canvas context based on mirror state
      if (mirror) {
        ctx.translate(videoWidth, 0);
        ctx.scale(-1, 1);
      }

      drawHand(hand, ctx);
    }
  };

  const updateFingerCount = (count) => {
    setPrevCounts((prev) => {
      const newCounts = [...prev, count];
      if (newCounts.length > 5) newCounts.shift(); // Keep the last 5 counts

      const averageCount = Math.round(
        newCounts.reduce((a, b) => a + b, 0) / newCounts.length
      );
      setFingerCount(averageCount);
      return newCounts;
    });
  };

  const countFingers = (landmarks) => {
    const tips = [4, 8, 12, 16, 20];
    const bases = [3, 6, 10, 14, 18];

    let count = 0;

    // Thumb: special case due to its unique movement
    // Check if thumb is extended
    if (landmarks[4][0] > landmarks[3][0]) {
      count++;
    }

    // Other fingers
    for (let i = 1; i < tips.length; i++) {
      // Check if finger is extended based on y-coordinates
      if (landmarks[tips[i]][1] < landmarks[bases[i]][1]) {
        count++;
      }
    }

    return count;
  };

  useEffect(() => {
    runHandpose();
    return () => {
      // Clean up timer on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Check if the finger count remains unchanged for 3 seconds
    if (fingerCount > 0 && !isCountLocked) {
      startLockTimer();
    } else {
      resetLockTimer();
    }
  }, [fingerCount]);

  const startLockTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setLockCount(fingerCount);
      setIsCountLocked(true);
    }, 1500);
  };

  const resetLockTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsCountLocked(false);
  };

  return (
    <div>
      <div>

        <div className="relative aspect-video w-[320px] h-[240px]">
          <Webcam
            ref={webcamRef}
            style={{
              transform: mirror ? "scaleX(-1)" : "scaleX(1)",
            }}
            className="absolute rounded-2xl"
          />
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center">
              <div className="text-white text-2xl">Loading...</div>
            </div>
          )}

          <canvas ref={canvasRef} className="absolute w-[320px] h-[240px]" />

          {/* <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            Locking in {(timerRef.current)}s
          </div> */}
        </div>

        <div className="text-4xl font-bold text-center text-white mt-8">
          <div>Current option: {fingerCount}</div>
          {/* <div>Locked option: {lockCount}</div> */}
        </div>
      </div>
    </div>
  );
}

export default LiveCam;
