"use client"

import Brama from "@/app/components/auth/Brama";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

export default function RoadmapDetails({ params }) {
  const [roadmapsData, setRoadmapsData] = useState([]);
  const [finishedCourses, setFinishedCourses] = useState([]);
      const [error, setError] = useState("");
      useEffect(() => {
        const email = localStorage.getItem("email");
        async function fetchData(){
          setError("");
          try {
    
              const response = await fetch("http://localhost:8080/roadmap/all", {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
    
              if (!response.ok) {
                  throw new Error(`Błąd `);
              }
              const data = await response.json();
              setRoadmapsData(data);
              
              const response2 = await fetch(`http://localhost:8080/${email}/finished-course-ids`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
  
            if (!response2.ok) {
                throw new Error(`Błąd `);
            }
            const data2 = await response2.json();
            setFinishedCourses(data2);
    
          } catch (err) {
              setError(err.message);
          }
          
        }
        fetchData();
              }, []);
        
  const resolvedParams = use(params);
  const { id } = resolvedParams || {};

  if (!roadmapsData.length) {
    return <div className="text-white p-10">Ładowanie danych...</div>;
  }

  const roadmapData = roadmapsData.find((element) => element.id == id);
  
  const finishedSet = new Set(finishedCourses.map(String));
  const completedSteps = roadmapData.courseList.filter((course) =>
    finishedSet.has(String(course.id))
  ).length;


  const progressPercentage =
    (completedSteps / roadmapData.courseList.length) * 100;
  
  return (
    <Brama>
<section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">
          {roadmapData.title}
        </h1>
        <div className="mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={
                i < roadmapData.rating ? "text-yellow-400" : "text-gray-400"
              }
            >
              &#9733;
            </span>
          ))}
        </div>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30 text-white mb-8">
          <p className="mb-4">{roadmapData.description}</p>
          <div className="flex justify-between mb-4">
            <span>
              <strong>Długość:</strong> {roadmapData.courseList.reduce((sum, course) => sum + Number(course.length), 0)}
            </span>
            <span>
              <strong>Ilość kursów:</strong> {roadmapData.courseList.length}
            </span>
          </div>
          <div className="mb-4">
            <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-sm mt-2">
              {completedSteps} z {roadmapData.courseList.length} ukończonych (
              {Math.round(progressPercentage)}%)
            </p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30 text-white">
          <h2 className="text-2xl font-semibold mb-4">Kroki w Roadmapie:</h2>
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 right-0 h-1 bg-gray-500/50 z-0 top-1/2 -translate-y-1/2" />
            {roadmapData.courseList.map((step, index) => {
              const isCompleted = finishedSet.has(String(step.id));
              const courseId = roadmapData.courseList[index].id;
              return (
                <Link key={index} href={`/courses/${courseId}`}>
                  <div className="relative z-10 flex flex-col items-center text-center flex-1">
                    <div
                      className={`rounded-full h-8 w-8 flex items-center justify-center mb-2 ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {isCompleted ? "1" : "0"}
                    </div>
                    <span className="text-sm whitespace-nowrap">
                      {step.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    </Brama>
    
  );
}
