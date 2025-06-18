"use client";

import { use, useEffect, useState } from "react";
import Brama from "@/app/components/auth/Brama";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

function pobierzKurs(idKursu) {
    return {
      id: Number(idKursu),
      tytul: "Wprowadzenie do HTML",
      lekcje: [
        {
          id: 1,
          tytul: "Wprowadzenie i historia HTML",
          czas: "30m",
          sektory: [
            { typ: "tekst", wartosc: "HTML (HyperText Markup Language) został zaproponowany przez Tima Bernersa‑Lee w 1991 roku jako język do publikowania dokumentów w Internecie." },
            { typ: "obraz", wartosc: "https://technologia-swiat.pl/wp-content/uploads/2024/07/OU5Fap5CuXhAesDLUjXnITsTUCl9tK3lTXbfe6gB.jpg", alt: "Tim Berners-Lee" },
            { typ: "film",  wartosc: "https://www.youtube.com/embed/20SHvU2PKsM" },
          ],
        },
      ],
    };
  }

export default function StronaLekcji({ params }) {
  const { id: courseId, lessonId: lessonId } = use(params);
  const [ukonczona, setUkonczona] = useState(false);
  const [flash, setFlash] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lessonsNoQuiz, setLessonsNoQuiz] = useState([]);
  const [error, setError] = useState("");
  const kluczStorage = `kurs:${courseId}:lekcja:${lessonId}:ukonczona`;


  const lekcjeZQuizem = [3];
  const maQuiz = lekcjeZQuizem.includes(Number(lessonId));

  useEffect(() => {
    setUkonczona(localStorage.getItem(kluczStorage) === "1");
  }, [kluczStorage]);
  useEffect(() => {
    async function fetchData(){
      setError("");
      try {

          const response = await fetch(`http://localhost:8080/sector/${lessonId}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error(`Błąd `);
          }
          const data = await response.json();
          setSectors(data);

          const response2 = await fetch(`http://localhost:8080/course/${courseId}/lessons`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response2.ok) {
            throw new Error(`Błąd `);
        }
        const data2 = await response2.json();
        setLessons(data2);

        const response3 = await fetch("http://localhost:8080/lesson/getWithoutQuiz", {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
    
              if (!response3.ok) {
                  throw new Error(`Błąd `);
              }
              const data3 = await response3.json();
              setLessonsNoQuiz(data3);

      } catch (err) {
          setError(err.message);
      }
    }
    fetchData();
          }, []);

  if (sectors.length === 0) {
    return (
      <Brama>
        <div className="flex items-center justify-center min-h-screen text-white">
          <h1 className="text-3xl">Lekcja nie została znaleziona.</h1>
        </div>
      </Brama>
    );
  }

  sectors.sort((a,b) => a.place - b.place);
  const thisLesson = lessons.findIndex(lesson => lesson.id === Number(lessonId));
  const poprzedniaLekcja = lessons[thisLesson-1];
  const nastepnaLekcja = lessons[thisLesson + 1];
  

  

  const toggleUkonczona = () => {
    const nowa = !ukonczona;
    setUkonczona(nowa);
    localStorage.setItem(kluczStorage, nowa ? "1" : "0");
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  };

  const renderSektor = (sektor, idx) => {
    switch (sektor.type) {
      case "text":
        return <p key={idx}>{sektor.value}</p>;
      case "image":
        return (
          <img
            key={idx}
            src={sektor.value}
            alt={sektor.alternative || "obraz"}
            className="my-6 rounded-lg shadow-lg mx-auto"
          />
        );
      case "video":
        return (
          <div key={idx} className="my-6 aspect-video">
            <iframe
              src={sektor.value}
              title="Film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-lg"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Brama>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 text-white max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href={`/courses/${courseId}`}
              className="text-sm hover:underline flex items-center gap-1"
            >
              <FaArrowLeft /> (Wróć do kursu)
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-2">{lessons[thisLesson].name}</h1>
          <p className="text-gray-200 mb-8 text-sm">Czas trwania: {lessons[thisLesson].description}</p>

          <article className="prose prose-invert max-w-none leading-relaxed">
            {sectors.map(renderSektor)}
          </article>

          {!lessonsNoQuiz.find((lessonNoQuiz) => lessonNoQuiz.id == lessonId) && (
            <div className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-md transition">
              <Link
                href={`/courses/${courseId}/${lessonId}/quiz`}
                className="inline-block px-8 py-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold shadow-md transition"
              >
                Rozwiąż quiz
              </Link>
            </div>
          )}

          <div className="flex justify-between mt-12">
            {poprzedniaLekcja ? (
              <Link
                href={`/courses/${courseId}/${poprzedniaLekcja.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                <FaArrowLeft /> {poprzedniaLekcja.name}
              </Link>
            ) : (
              <span />
            )}

            {nastepnaLekcja ? (
              <Link
                href={`/courses/${courseId}/${nastepnaLekcja.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                {nastepnaLekcja.name} <FaArrowRight />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>
    </Brama>
  );
}
