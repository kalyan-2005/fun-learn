"use client";
import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import axios from "axios";
import { headers } from "next/headers";
// components/ImageSelector.js
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const images = [
  { url: "https://i.ibb.co/SJ5qRnR/teacher-1.jpg", voice_id: "Xb7hH8MSUJpSbSDYk0k2" },
  { url: "https://i.ibb.co/SJ5qRnR/teacher-1.jpg", voice_id: "bIHbv24MWmeRgasZH58o" },
  { url: "https://i.ibb.co/vYXdjJX/teacher-1.gif", voice_id: "XrExE9yKIg1WjnnlVkGX" },
  { url: "https://i.ibb.co/vYXdjJX/teacher-1.gif", voice_id: "cgSgspJ2msm6clMCkdW9" },
];

const ImageSelector = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const handleImageClick = async (image: any) => {
    try {
      await axios.post("/api/updateUser", {
        imgurl: image.url,
        voiceid: image.voice_id,
      });
      setSelectedImage(image);
      toast.success("Character selected successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 gap-6">
      {/* Selected Image */}
      <div className="relative mb-4">
        <img
          src={selectedImage.url}
          alt="Selected"
          className="object-cover border-4 border-blue-500 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out scale-110"
          width={200}
          height={200}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex space-x-4">
        {images.map((image, index) => (
          <div key={index} className="cursor-pointer">
            <img
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className={`object-cover rounded-lg border ${
                selectedImage === image
                  ? "border-blue-500"
                  : "border-transparent"
              } transition duration-200 ease-in-out transform hover:scale-105`}
              onClick={() => handleImageClick(image)}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelector;
