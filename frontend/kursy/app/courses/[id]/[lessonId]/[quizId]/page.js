"use client";

import { useEffect, useState, use } from "react";
import Brama from "@/app/components/auth/Brama";

function pobierzQuiz(lessonId) {
  return {
    id: Number(lessonId),
    tytul: "Quiz do lekcji",
    pytania: [
      {
        id: 1,
        tresc: "Kto stworzył HTML?",
        odpowiedzi: ["Brendan Eich", "Tim Berners-Lee", "Linus Torvalds", "Bill Gates"],
        poprawna: 1,
      },
      {
        id: 2,
        tresc: "Jaki znacznik oznacza paragraf w HTML?",
        odpowiedzi: ["<div>", "<section>", "<p>", "<html>"],
        poprawna: 2,
      },
      {
        id: 3,
        tresc: "Który znacznik HTML używamy do obrazków?",
        odpowiedzi: ["<img>", "<src>", "<image>", "<picture>"],
        poprawna: 0,
      },
      {
        id: 4,
        tresc: "Czym jest CSS?",
        odpowiedzi: [
          "Językiem programowania",
          "Systemem baz danych",
          "Językiem stylowania stron",
          "Frameworkiem JavaScriptu",
        ],
        poprawna: 2,
      },
      {
        id: 5,
        tresc: "Które rozszerzenie ma zwykle plik HTML?",
        odpowiedzi: [".htm", ".html", ".php", ".js"],
        poprawna: 1,
      },
    ],
  };
}


export default function QuizLekcji({ params }) {
  const { id: courseId, lessonId: lessonId } = use(params);
  const [quiz, setQuiz] = useState(null);
  const [odpowiedzi, setOdpowiedzi] = useState({});
  const [oceniono, setOceniono] = useState(false);
  const [wynik, setWynik] = useState(0);

  useEffect(() => {
    const dane = pobierzQuiz(lessonId);
    setQuiz(dane);
  }, [lessonId]);

  if (!quiz) {
    return (
      <Brama>
        <div className="min-h-screen flex justify-center items-center text-white">
          <h1>Ładowanie quizu...</h1>
        </div>
      </Brama>
    );
  }

  const ocenQuiz = () => {
    let suma = 0;
    quiz.pytania.forEach(pytanie => {
      if (odpowiedzi[pytanie.id] === pytanie.poprawna) suma++;
    });
    setWynik(suma);
    setOceniono(true);
  };

  return (
    <Brama>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 pt-20 pb-10 px-4 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{quiz.tytul}</h1>

          {quiz.pytania.map((pytanie, idx) => (
            <div key={pytanie.id} className="mb-8">
              <h2 className="font-semibold text-lg mb-2">
                {idx + 1}. {pytanie.tresc}
              </h2>
              <ul className="space-y-2">
                {pytanie.odpowiedzi.map((odp, i) => (
                  <li key={i}>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`pytanie-${pytanie.id}`}
                        value={i}
                        disabled={oceniono}
                        checked={odpowiedzi[pytanie.id] === i}
                        onChange={() =>
                          setOdpowiedzi(prev => ({ ...prev, [pytanie.id]: i }))
                        }
                      />
                      {odp}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {!oceniono ? (
            <button
                onClick={ocenQuiz}
                className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700 transition"
            >
                Zakończ quiz i oceń
            </button>
            ) : (
            <div className="mt-6 text-xl">
                <p className="mb-4">
                Wynik: {wynik} / {quiz.pytania.length} (
                {Math.round((wynik / quiz.pytania.length) * 100)}%)
                </p>

                {wynik / quiz.pytania.length >= 0.8 ? (
                <div className="space-y-4">
                    <p className="text-green-400 font-semibold">Gratulacje! Zaliczyłeś quiz 🎉</p>
                    <div className="flex gap-4 flex-wrap">
                    <a
                        href={`/courses/${courseId}`}
                        className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                    >
                        Wróć do kursu
                    </a>
                    <a
                        href={`/courses/${courseId}/123`}
                        className="px-5 py-2 rounded-md bg-green-600 hover:bg-green-700"
                    >
                        Przejdź do następnej lekcji
                    </a>
                    </div>
                </div>
                ) : (
                <div className="space-y-4">
                    <p className="text-red-400 font-semibold">Niestety, nie udało się zdać. Potrzebujesz co najmniej 80%, by móc zdać. 😢</p>
                    <div className="flex gap-4 flex-wrap">
                    <button
                    className="px-5 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => {
                        setOceniono(false);
                        setOdpowiedzi({});
                        setWynik(0);
                    }}
                    >
                    Spróbuj ponownie
                    </button>
                    <a
                        href={`/courses/${courseId}`}
                        className="px-5 py-2 rounded-md bg-blue-500 hover:bg-blue-700"
                    >
                        Wróć do kursu
                    </a>
                    </div>
                </div>
                )}
            </div>
            )}
        </div>
      </div>
    </Brama>
  );
}
