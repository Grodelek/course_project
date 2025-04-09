import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import Navigation from "../../components/navigation/navigation.js";

export default function RoadmapDetails({ params }) {
  const { id } = params;
  const userName = "Filip";

  const roadmapData = {
    id: Number(id),
    title: "Web Mejster",
    description:
      "Nauczysz się HTML, CSS, JavaScript oraz nowoczesnych frameworków, aby zbudować solidne projekty webowe. Ta roadmapa pomoże Ci przejść od podstawowych zagadnień do zaawansowanych technik tworzenia stron.",
    length: "10h",
    stepsCount: 8,
    rating: 4,
    steps: [
      { id: 1, title: "Wprowadzenie do HTML", completed: 1 },
      { id: 2, title: "Podstawy CSS", completed: 1 },
      { id: 3, title: "JavaScript od podstaw", completed: 0 },
      { id: 4, title: "Responsywność strony", completed: 1 },
      { id: 5, title: "Framework CSS", completed: 0 },
      { id: 6, title: "Projektowanie interfejsów", completed: 0 },
      { id: 7, title: "Zarządzanie stanem", completed: 0 },
      { id: 8, title: "Optymalizacja i wdrożenie", completed: 0 },
    ],
    stepsID: [1, 2, 3, 4, 5, 6, 7, 8],
  };

  const completedSteps = roadmapData.steps.filter(
    (step) => step.completed === 1
  ).length;
  const progressPercentage =
    (completedSteps / roadmapData.stepsCount) * 100;

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      <Navigation userName={userName} />
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
              <strong>Długość:</strong> {roadmapData.length}
            </span>
            <span>
              <strong>Ilość kursów:</strong> {roadmapData.stepsCount}
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
              {completedSteps} z {roadmapData.stepsCount} ukończonych (
              {Math.round(progressPercentage)}%)
            </p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30 text-white">
          <h2 className="text-2xl font-semibold mb-4">Kroki w Roadmapie:</h2>
          <div className="relative flex items-center justify-between w-full">
            <div className="absolute left-0 right-0 h-1 bg-gray-500/50 z-0 top-1/2 -translate-y-1/2" />
            {roadmapData.steps.map((step, index) => {
              const isCompleted = step.completed === 1;
              const courseId = roadmapData.stepsID[index];
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
                      {step.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
