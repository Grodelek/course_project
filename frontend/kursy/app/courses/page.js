"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navigation from "../components/navigation/navigation.js";

export default function Courses() {
  //const [coursesData, setCoursesData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchData(){
      setError("");
      try {

          const response = await fetch("http://localhost:8080/course/all", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error(`Błąd `);
          }
          const data = await response.json();
          setCoursesData(data);

      } catch (err) {
          setError(err.message);
      }
    }
    fetchData();
          }, []);

  const userName = 'Filip';


  // paginacja
  const itemsPerPage = 3;
  const totalPages = Math.ceil(coursesData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = coursesData.slice(indexOfFirstItem, indexOfLastItem);

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      <Navigation userName={userName} />

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Kursy</h1>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30">
          <table className="min-w-full text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Nazwa
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Długość
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Ocena
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((course) => (
                <tr key={course.id} className="border-b border-white/20">
                  <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.length}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < course.rating ? "text-yellow-400" : "text-gray-400"}
                      >
                        &#9733;
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/courses/${course.id}`}>
                      <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer transition-colors">
                        Zobacz
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Brak kursów do wyświetlenia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/20 border border-white/20 rounded text-white hover:bg-white/30 disabled:opacity-50 transition"
            >
              Poprzednia
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded border border-white/20 transition ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/20 border border-white/20 rounded text-white hover:bg-white/30 disabled:opacity-50 transition"
            >
              Następna
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}