"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Brama from "../../components/auth/Brama";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Roadmaps() {
  const [roadmapsData, setRoadmapsData] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
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

      } catch (err) {
          setError(err.message);
      }
    }
    fetchData();
          }, []);

  // paginacja
  const itemsPerPage = 10;
  const totalPages = Math.ceil(roadmapsData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = roadmapsData.slice(indexOfFirstItem, indexOfLastItem);

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  // Dla Andrzeja
  const edytujKurs = (id) => {
  };
  const usuńKurs = async (id) => {
  };
  return (
    <Brama>
<section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Roadmapy</h1>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30">
          <table className="min-w-full text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Nazwa Roadmapy
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Ilość kursów
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((roadmap) => (
                <tr key={roadmap.id} className="border-b border-white/20">
                  <td className="px-6 py-4 whitespace-nowrap">{roadmap.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{roadmap.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{roadmap.courseList.length}</td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => edytujKurs(roadmap.id)}
                      className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded transition"
                    >
                      <FaEdit /> Edytuj
                    </button>

                    <button
                      onClick={() => usuńKurs(roadmap.id)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      <FaTrash /> Usuń
                    </button>
                  </div>
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
    </Brama>
    
  );
}