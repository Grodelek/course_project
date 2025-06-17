"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Brama from "../../components/auth/Brama";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Roadmaps() {
  const [roadmapsData, setRoadmapsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [editRoadmapName, setEditRoadmapName] = useState("");

  useEffect(() => {
    async function fetchData() {
      setError("");
      try {
        // Fetch roadmaps
        const roadmapsResponse = await fetch("http://localhost:8080/roadmap/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!roadmapsResponse.ok) {
          throw new Error(`Błąd pobierania roadmap`);
        }
        const roadmapsData = await roadmapsResponse.json();
        setRoadmapsData(roadmapsData);

        // Fetch courses
        const coursesResponse = await fetch("http://localhost:8080/course/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!coursesResponse.ok) {
          throw new Error(`Błąd pobierania kursów`);
        }
        const coursesData = await coursesResponse.json();
        setCoursesData(coursesData);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  // Paginacja
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

  const edytujRoadmap = (id) => {
    const roadmap = roadmapsData.find((r) => r.id === id);
    if (roadmap) {
      setSelectedRoadmapId(id);
      setEditRoadmapName(roadmap.name);
      setEditModalOpen(true);
    }
  };

  const zapiszEdycjeRoadmapy = async () => {
    try {
      const roadmap = roadmapsData.find((r) => r.id === selectedRoadmapId);
      const response = await fetch(`http://localhost:8080/roadmap/update/${selectedRoadmapId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editRoadmapName,
          courseIds: roadmap.courseList.map((c) => c.id),
        }),
      });

      if (!response.ok) throw new Error("Błąd przy edycji roadmapy.");

      const refreshed = await fetch("http://localhost:8080/roadmap/all");
      const data = await refreshed.json();
      setRoadmapsData(data);
      setEditModalOpen(false);
      setEditRoadmapName("");
      setSelectedRoadmapId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const usuńRoadmap = async (id) => {
    const roadmap = roadmapsData.find((r) => r.id === id);
    if (!roadmap) return;

    if (window.confirm(`Czy na pewno chcesz usunąć roadmapę ${roadmap.name}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/roadmap/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Błąd przy usuwaniu roadmapy.");

        const refreshed = await fetch("http://localhost:8080/roadmap/all");
        const data = await refreshed.json();
        setRoadmapsData(data);
      } catch (err) {
        setError(err.message);
      }
    }
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

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => edytujRoadmap(roadmap.id)}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded transition"
                        >
                          <FaEdit /> Edytuj
                        </button>
                        <button
                          onClick={() => usuńRoadmap(roadmap.id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                        >
                          <FaTrash /> Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      Brak roadmap do wyświetlenia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {editModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h2 className="text-xl font-bold mb-4">Edytuj roadmapę</h2>

                  <label className="block mb-1 text-sm">Nazwa roadmapy:</label>
                  <input
                    type="text"
                    value={editRoadmapName}
                    onChange={(e) => setEditRoadmapName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditModalOpen(false);
                        setEditRoadmapName("");
                        setSelectedRoadmapId(null);
                      }}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={zapiszEdycjeRoadmapy}
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            )}

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