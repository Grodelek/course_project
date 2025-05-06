import Brama from "@/app/components/auth/Brama";
import Link from "next/link";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";

export default async function CourseDetails({ params }) {
  const { courseId } = params;

  const courseData = {
    id: Number(courseId),
    title: "Wprowadzenie do HTML",
    description:
      "Kurs wprowadzający do podstaw HTML. Nauczysz się struktury dokumentu, podstawowych tagów oraz semantycznego oznaczania treści. Kurs jest przeznaczony dla początkujących, którzy chcą rozpocząć swoją przygodę z tworzeniem stron internetowych.",
    duration: "5h",
    rating: 4,
    lessons: [
      { id: 1, title: "Wprowadzenie i historia HTML", duration: "30m", completed: 1 }, // ostatnia 1 to jest to że jest ukończony 0 to nie jest
      { id: 2, title: "Struktura dokumentu HTML", duration: "45m", completed: 0 },
      { id: 3, title: "Podstawowe tagi HTML", duration: "1h", completed: 1 },
      { id: 4, title: "Formularze w HTML", duration: "50m", completed: 0 },
      { id: 5, title: "Zaawansowane techniki HTML", duration: "1h15m", completed: 0 },
    ],
  };

  const completedLessons = courseData.lessons.filter(lesson => lesson.completed === 1).length;
  const progressPercentage =
    (completedLessons / courseData.lessons.length) * 100;

  return (
    <Brama>
<section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">

        <h1 className="text-4xl font-bold text-white mb-4">{courseData.title}</h1>
        <div className="mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < courseData.rating ? "text-yellow-400" : "text-gray-400"}
            >
              &#9733;
            </span>
          ))}
        </div>
        <p className="text-white mb-6">{courseData.description}</p>
        <div className="flex justify-between mb-6">
          <span className="text-white">
            <strong>Czas trwania:</strong> {courseData.duration}
          </span>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm mt-2 text-white">
            {completedLessons} z {courseData.lessons.length} lekcji ukończonych (
            {Math.round(progressPercentage)}%)
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30 text-white">
  <h2 className="text-2xl font-semibold mb-4">Lekcje:</h2>
  <ul className="space-y-2">
    {courseData.lessons.map((lesson) => (
      <li
        key={lesson.id}
        className="grid grid-cols-[1fr_auto_auto] items-center border-b border-white/30 py-3 gap-4"
      >
        <div>
          <p className="font-semibold">{lesson.title}</p>
          <p className="text-sm text-gray-200">{lesson.duration}</p>
        </div>

        <Link
                    href={`/courses/${courseData.id}/${lesson.id}`}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition"
                  >
                    Przejdź
                  </Link>

        <div className="justify-self-end">
          {lesson.completed ? (
            <FaCheckCircle className="text-green-500 text-2xl" />
          ) : (
            <FaRegCheckCircle className="text-gray-500 text-2xl" />
          )}
        </div>
      </li>
    ))}
  </ul>
</div>
      </div>
    </section>
    </Brama>
    
  );
}
