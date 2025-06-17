"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Brama from "../../components/auth/Brama";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Lessons() {
  const [lessonsData, setLessonsData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [editLessonName, setEditLessonName] = useState("");
  const [editCourseId, setEditCourseId] = useState("");
  const [editLessonDescription, setEditLessonDescription] = useState("");

  useEffect(() => {
    async function fetchData() {
      setError("");
      try {
        // Fetch lessons
        const lessonsResponse = await fetch("http://localhost:8080/lesson/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!lessonsResponse.ok) {
          throw new Error(`Błąd pobierania lekcji`);
        }
        const lessonsData = await lessonsResponse.json();
        setLessonsData(lessonsData);

        // Fetch courses for dropdown
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
  const totalPages = Math.ceil(lessonsData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = lessonsData.slice(indexOfFirstItem, indexOfLastItem);

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const edytujKurs = (id) => {
    const lesson = lessonsData.find((l) => l.id === id);
    if (lesson) {
      setSelectedLessonId(id);
      setEditLessonName(lesson.name);
      setEditCourseId(lesson.course.id);
      setEditLessonDescription(lesson.description || "");
      setEditModalOpen(true);
    }
  };

  const zapiszEdycjeLekcji = async () => {
    try {
      const response = await fetch(`http://localhost:8080/lesson/update/${selectedLessonId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editLessonName,
          courseId: editCourseId,
          description: editLessonDescription,
        }),
      });

      if (!response.ok) throw new Error("Błąd przy edycji lekcji.");

      const refreshed = await fetch("http://localhost:8080/lesson/all");
      const data = await refreshed.json();
      setLessonsData(data);
      setEditModalOpen(false);
      setEditLessonName("");
      setEditCourseId("");
      setEditLessonDescription("");
      setSelectedLessonId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const usuńKurs = async (id) => {
    const lesson = lessonsData.find((l) => l.id === id);
    if (!lesson) return;

    if (window.confirm(`Czy na pewno chcesz usunąć lekcję ${lesson.name}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/lesson/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Błąd przy usuwaniu lekcji.");

        const refreshed = await fetch("http://localhost:8080/lesson/all");
        const data = await refreshed.json();
        setLessonsData(data);
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
          <h1 className="text-4xl font-bold text-center mb-8 text-white">Lekcje</h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30">
            <table className="min-w-full text-white">
              <thead>
                <tr className="border-b border-white/30">
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Id
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Nazwa lekcji
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Nazwa kursu
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Czas trwania
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((lesson) => (
                  <tr key={lesson.id} className="border-b border-white/20">
                    <td className="px-6 py-4 whitespace-nowrap">{lesson.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lesson.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lesson.course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lesson.description || "Brak"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => edytujKurs(lesson.id)}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded transition"
                        >
                          <FaEdit /> Edytuj
                        </button>
                        <button
                          onClick={() => usuńKurs(lesson.id)}
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
                    <td colSpan={5} className="px-6 py-4 text-center">
                      Brak lekcji do wyświetlenia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {editModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                  <h2 className="text-xl font-bold mb-4">Edytuj lekcję</h2>

                  <label className="block mb-1 text-sm">Nazwa lekcji:</label>
                  <input
                    type="text"
                    value={editLessonName}
                    onChange={(e) => setEditLessonName(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  />

                  <label className="block mb-1 text-sm">Kurs:</label>
                  <select
                    value={editCourseId}
                    onChange={(e) => setEditCourseId(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                  >
                    <option value="">Wybierz kurs</option>
                    {coursesData.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>

                  <label className="block mb-1 text-sm">Czas trwania (np. 1h45m):</label>
                  <input
                    type="text"
                    value={editLessonDescription}
                    onChange={(e) => setEditLessonDescription(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    placeholder="np. 1h45m lub 15m"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditModalOpen(false);
                        setEditLessonName("");
                        setEditCourseId("");
                        setEditLessonDescription("");
                        setSelectedLessonId(null);
                      }}
                      className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={zapiszEdycjeLekcji}
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