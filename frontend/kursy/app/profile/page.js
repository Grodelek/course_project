"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Brama from "../components/auth/Brama";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

export default function StronaProfilu() {
  const router = useRouter();
  const [imie, setImie] = useState("");
  const [email, setEmail] = useState("");
  const [sciezkaZdjecia, setSciezkaZdjecia] = useState("");
  const [courses, setCourses] = useState([]);
  const [finishedCourses, setFinishedCourses] = useState([]);
  const [aktualneKursy, setAktualneKursy] = useState([]);
  const [ukonczoneKursy, setUkonczoneKursy] = useState([
    { id: 3, tytul: "JavaScript od podstaw", zakonczono: "2025-05-10" },
    { id: 4, tytul: "Responsywność strony", zakonczono: "2025-04-28" },
  ]);
  const [error, setError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const zapamietanyEmail = localStorage.getItem("email");
    if (!token || !zapamietanyEmail) {
      router.replace("/");
      return;
    }
    setEmail(zapamietanyEmail);
    setImie(localStorage.getItem("userName") || "");
    setSciezkaZdjecia(localStorage.getItem("photoPath") || "");
  }, [router]);
useEffect(() => {
    if (!email) return;
    async function fetchData(){
      setError("");
      try {

          const response = await fetch(`http://localhost:8080/coursesPercentage?email=${encodeURIComponent(email)}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error(`Błąd `);
          }
          const data = await response.json();
          setAktualneKursy(data);

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

          const response3 = await fetch(`http://localhost:8080/course/all`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response3.ok) {
              throw new Error(`Błąd `);
          }
          const data3 = await response3.json();
          setCourses(data3);
          } catch (err) {
          setError(err.message);
      }
    }
    fetchData();
          }, [email]);

    useEffect(() => {
      if (!courses || courses.length === 0) return;

      const zakonczone = courses.filter(course =>
        finishedCourses.includes(course.id)
      );

      setUkonczoneKursy(zakonczone);
    }, [courses]);

  const wyloguj = () => {
    localStorage.clear();
    router.replace("/");
    window.location.reload();
  };

  const urlZdjecia = sciezkaZdjecia
    ? `https://courseapp-bucket.s3.eu-north-1.amazonaws.com/${sciezkaZdjecia}`
    : null;



  return (
    <Brama>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 space-y-8">
          <h1 className="text-4xl font-bold text-white">Twój Profil</h1>

          <div className="mx-auto max-w-md bg-white/20 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6 text-white">
            <div className="flex flex-col items-center mb-6">
              {urlZdjecia ? (
                <img
                  src={urlZdjecia}
                  alt="Zdjęcie profilowe"
                  className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-white/50"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-500 mb-4" />
              )}
              <p className="text-2xl font-bold">{imie || "—"}</p>
              <p className="text-sm text-gray-200">Nazwa użytkownika</p>
            </div>
            <div className="flex items-center justify-center mb-6 space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm4 8v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1"
                />
              </svg>
              <div>
                <p className="text-base">{email}</p>
                <p className="text-sm text-gray-200">Adres e‑mail</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push("/profile/edit")}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <FaUserEdit />
                <span>Edytuj profil</span>
              </button>
              <button
                onClick={wyloguj}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
              >
                <FaSignOutAlt />
                <span>Wyloguj się</span>
              </button>
            </div>
          </div>

          <div className="mx-auto max-w-2xl bg-white/20 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6 text-white">
            <h2 className="text-2xl font-semibold mb-4">Aktualne kursy</h2>
            <div className="space-y-4">
              {aktualneKursy.map((kurs) => (
                <Link key={kurs.courseId} href={`/courses/${kurs.courseId}`}>
                  <div className="group bg-white/10 hover:bg-white/20 rounded-lg p-4 flex items-center justify-between transition">
                    <div className="w-60">{kurs.courseName}</div>
                    <div className="w-32 h-3 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-width"
                        style={{ width: `${kurs.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-200">{kurs.progress}%</span>
                  </div>
                </Link>
              ))}
              {aktualneKursy.length === 0 && <p>Brak aktualnych kursów.</p>}
            </div>
          </div>

          <div className="mx-auto max-w-2xl bg-white/20 backdrop-blur-sm rounded-xl shadow-xl border border-white/30 p-6 text-white">
            <h2 className="text-2xl font-semibold mb-4">Ukończone kursy</h2>
            <ul className="space-y-3">
              {ukonczoneKursy.map((kurs) => (
                <li key={kurs.id} className="flex justify-between items-center">
                  <Link href={`/courses/${kurs.id}`}>
                    <span className="hover:underline">{kurs.name}</span>
                  </Link>
                </li>
              ))}
              {ukonczoneKursy.length === 0 && <p>Brak ukończonych kursów.</p>}
            </ul>
          </div>
        </div>
      </section>
    </Brama>
  );
}
