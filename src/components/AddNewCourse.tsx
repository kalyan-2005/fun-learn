"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

function AddNewCourse() {
    const [course, setCourse] = useState<string>('');
    const handleSubmit = async() => {
        if(course === '') {
            console.log("Course name cannot be empty");
            return;
        }
        toast.loading("Creating new course for you...");
        try {
            const response = await fetch("/api/new-course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ course }),
            });
            const data = await response.json();
            if (data.error) {
                toast.dismiss();
                toast.error(data.error);
                return;
            }
            toast.dismiss();
            toast.success("Course created successfully");
        } catch (error) {
            toast.error("Error creating course");
            return;
        }
    }
  return (
    <div>
      <input
      onChange={(e) => setCourse(e.target.value)}
        className="p-1 px-2 rounded-s text-sm border outline-none border-blue-500"
        type="text"
        placeholder="Enter concept..."
      />
      <button onClick={handleSubmit} className="p-1 px-2 rounded-e text-sm bg-blue-500 hover:bg-violet-400 hover:scale-105 duration-500">
        Add New Course
      </button>
    </div>
  );
}

export default AddNewCourse;
