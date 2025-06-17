"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Brama from "../../components/auth/Brama";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Courses() {
  const [coursesData, setCoursesData] = useState([]);
  const [roadmapsData, setRoadmapsData] = useState([]);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [editCourseName, setEditCourseName] = useState("");
  const [editCourseDescription, setEditCourseDescription] = useState("");
  const [editRoadmapId, setEditRoadmapId] = useState("");
  const [addModalOpen, setAddModalOpen]       = useState(false);
  const [newCourseName, setNewCourseName]     = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");

  useEffect(() => {
    async function fetchData() {
      setError("");
      try {
        // Fetch courses
        const courseResponse = await fetch("http://localhost:8080/course/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!courseResponse.ok) {
          throw new Error(`Błąd pobierania kursów`);
        }
        const courseData = await courseResponse.json();
        setCoursesData(courseData);

        // Fetch roadmaps
        const roadmapResponse = await fetch("http://localhost:8080/roadmap/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!roadmapResponse.ok) {
          throw new Error(`Błąd pobierania roadmap`);
        }
        const roadmapData = await roadmapResponse.json();
        setRoadmapsData(roadmapData);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  // Helper function to find roadmap ID for a course
  const getRoadmapForCourse = (courseId) => {
    for (const roadmap of roadmapsData) {
      if (roadmap.courseList.some((course) => course.id === courseId)) {
        return roadmap;
      }
    }
    return null;
  };

  // Paginacja
  const itemsPerPage = 10;
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

  const edytujKurs = (id) => {
    const course = coursesData.find((c) => c.id === id);
    if (course) {
      const roadmap = getRoadmapForCourse(id);
      setSelectedCourseId(id);
      setEditCourseName(course.name);
      setEditCourseDescription(course.description);
      setEditRoadmapId(roadmap ? roadmap.id.toString() : "");
      setEditModalOpen(true);
    }
  };

  const zapiszEdycjeKursu = async () => {
    try {
      const response = await fetch(`http://localhost:8080/course/update/${selectedCourseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editCourseName,
          description: editCourseDescription,
          roadmapId: editRoadmapId ? parseInt(editRoadmapId) : null,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Błąd przy edycji kursu: ${errorText}`);
      }

      // Refresh courses and roadmaps to reflect updated associations
      const [courseResponse, roadmapResponse] = await Promise.all([
        fetch("http://localhost:8080/course/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("http://localhost:8080/roadmap/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!courseResponse.ok || !roadmapResponse.ok) {
        throw new Error("Błąd przy odświeżaniu danych");
      }

      const courseData = await courseResponse.json();
      const roadmapData = await roadmapResponse.json();
      setCoursesData(courseData);
      setRoadmapsData(roadmapData);

      setEditModalOpen(false);
      setEditCourseName("");
      setEditCourseDescription("");
      setEditRoadmapId("");
      setSelectedCourseId(null);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const dodajKurs = async () => {
  if (!newCourseName.trim()) {
    setError("Nazwa kursu nie może być pusta");
    return;
  }
  try {
    const res = await fetch("http://localhost:8080/course/add", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify({
        name       : newCourseName,
        description: newCourseDescription,
      }),
    });
    if (!res.ok) throw new Error(await res.text());

    const fresh = await fetch("http://localhost:8080/course/all").then(r=>r.json());
    setCoursesData(fresh);

    setAddModalOpen(false);
    setNewCourseName("");
    setNewCourseDescription("");
  } catch (e) {
    setError("Błąd dodawania kursu: " + e.message);
  }
};


  const usuńKurs = async (id) => {
    const course = coursesData.find((c) => c.id === id);
    if (!course) return;

    if (window.confirm(`Czy na pewno chcesz usunąć kurs ${course.name}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/course/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Błąd przy usuwaniu kursu: ${errorText}`);
        }

        // Refresh courses and roadmaps
        const [courseResponse, roadmapResponse] = await Promise.all([
          fetch("http://localhost:8080/course/all", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
          fetch("http://localhost:8080/roadmap/all", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        ]);

        if (!courseResponse.ok || !roadmapResponse.ok) {
          throw new Error("Błąd przy odświeżaniu danych");
        }

        const courseData = await courseResponse.json();
        const roadmapData = await roadmapResponse.json();
        setCoursesData(courseData);
        setRoadmapsData(roadmapData);
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
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Kursy</h1>
<div className="flex justify-between items-center mb-4">
  <h1 className="text-4xl font-bold text-white">Kursy</h1>

  <button
    onClick={() => setAddModalOpen(true)}
    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
  >
    + Nowy kurs
  </button>
</div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30">
            <table className="min-w-full text-white">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Id
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Nazwa kursu
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Opis
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Ilość lekcji
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Roadmapa
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((course) => {
                  const roadmap = getRoadmapForCourse(course.id);
                  return (
                    <tr key={course.id} className="border-b border-white/20">
                      <td className="px-6 py-4 whitespace-nowrap">{course.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{course.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{course.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{course.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{roadmap ? roadmap.name : "Brak"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => edytujKurs(course.id)}
                            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded transition"
                          >
                            <FaEdit /> Edytuj
                          </button>
                          <button
                            onClick={() => usuńKurs(course.id)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                          >
                            <FaTrash /> Usuń
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      Brak kursów do wyświetlenia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {addModalOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="w-full max-w-lg bg-white/10 border border-white/30 rounded-2xl p-8 text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-center">Dodaj nowy kurs</h2>

                  <label className="block text-sm font-medium mb-1">Nazwa kursu</label>
                  <input
                    type="text"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 mb-4 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="np. HTML od podstaw"
                  />

                  <label className="block text-sm font-medium mb-1">Opis (opcjonalnie)</label>
                  <textarea
                    rows={3}
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 mb-6 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    placeholder="Krótki opis kursu"
                  />

                  {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setAddModalOpen(false);
                        setNewCourseName("");
                        setNewCourseDescription("");
                        setError("");
                      }}
                      className="px-5 py-2 rounded-lg bg-gray-500/40 hover:bg-gray-500/60 transition"
                    >
                      Anuluj
                    </button>

                    <button
                      onClick={dodajKurs}
                      className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold shadow-md transition"
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              </div>
            )}


            {editModalOpen && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="w-full max-w-lg bg-white/10 border border-white/30 rounded-2xl p-8 text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 text-center">Edytuj kurs</h2>

                  <label className="block text-sm font-medium mb-1">Nazwa kursu</label>
                  <input
                    type="text"
                    value={editCourseName}
                    onChange={(e) => setEditCourseName(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 mb-4 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  <label className="block text-sm font-medium mb-1">Opis</label>
                  <textarea
                    rows={3}
                    value={editCourseDescription}
                    onChange={(e) => setEditCourseDescription(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 mb-4 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Wprowadź opis kursu"
                  />

                  <label className="block text-sm font-medium mb-1">Roadmapa</label>
                  <select
                    value={editRoadmapId}
                    onChange={(e) => setEditRoadmapId(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 mb-6 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Brak roadmapy</option>
                    {roadmapsData.map((roadmap) => (
                      <option key={roadmap.id} value={roadmap.id}>
                        {roadmap.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditModalOpen(false);
                        setSelectedCourseId(null);
                        setEditCourseName("");
                        setEditCourseDescription("");
                        setEditRoadmapId("");
                      }}
                      className="px-5 py-2 rounded-lg bg-gray-500/40 hover:bg-gray-500/60 transition"
                    >
                      Anuluj
                    </button>

                    <button
                      onClick={zapiszEdycjeKursu}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold shadow-md transition"
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