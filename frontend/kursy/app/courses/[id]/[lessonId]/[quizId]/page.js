"use client";

import { use, useEffect, useState } from "react";
import Brama from "@/app/components/auth/Brama";

export default function QuizLekcji({ params }) {
  const { id: courseId, lessonId } = use(params);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: [answerId1, answerId2, ...] or answerId }
  const [oceniono, setOceniono] = useState(false);
  const [wynik, setWynik] = useState(0);
  const [error, setError] = useState("");
  const [lesson, setLesson] = useState(null);

  const completion = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(`http://localhost:8080/${email}/finished-lessons/${lessonId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd przy oznaczaniu lekcji jako ukończonej`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (oceniono && wynik / quiz.length >= 0.8) {
      completion();
    }
  }, [oceniono, wynik]);

  useEffect(() => {
    async function fetchData() {
      setError("");
      try {
        const response = await fetch(`http://localhost:8080/question/${lessonId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd pobierania quizu`);
        }
        const data = await response.json();
        setQuiz(data);

        const response2 = await fetch(`http://localhost:8080/question/lesson/${lessonId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response2.ok) {
          throw new Error(`Błąd pobierania lekcji`);
        }
        const data2 = await response2.json();
        setLesson(data2);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  if (!quiz || !lesson) {
    return (
      <Brama>
        <div className="min-h-screen flex justify-center items-center text-white">
          <h1>Ładowanie quizu...</h1>
        </div>
      </Brama>
    );
  }

  const isMultipleCorrect = (question) => {
    return question.answers.filter((ans) => ans.correct).length > 1;
  };

  const handleAnswerChange = (questionId, answerId, isMultiple) => {
    if (isMultiple) {
      setAnswers((prev) => {
        const currentAnswers = prev[questionId] || [];
        if (currentAnswers.includes(answerId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== answerId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, answerId],
          };
        }
      });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerId,
      }));
    }
  };

  const ocenQuiz = () => {
    let suma = 0;
    quiz.forEach((question) => {
      const correctAnswers = question.answers
        .filter((ans) => ans.correct)
        .map((ans) => ans.id);
      const selectedAnswers = answers[question.id] || [];

      if (isMultipleCorrect(question)) {
        // For multiple correct answers, check if all correct are selected and no incorrect
        const allCorrectSelected = correctAnswers.every((id) =>
          selectedAnswers.includes(id)
        );
        const noIncorrectSelected = selectedAnswers.every((id) =>
          correctAnswers.includes(id)
        );
        if (allCorrectSelected && noIncorrectSelected && selectedAnswers.length > 0) {
          suma++;
        }
      } else {
        // For single correct answer, check if the selected answer is correct
        if (selectedAnswers === correctAnswers[0]) {
          suma++;
        }
      }
    });
    setWynik(suma);
    setOceniono(true);
  };

  return (
    <Brama>
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-gray-900 pt-20 pb-10 px-4 text-white">
        <div className="max-w-3xl mx-auto mt-20">
          <h1 className="text-3xl font-bold mb-6">Quiz: {lesson.name}</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          {quiz.map((question, idx) => {
            const isMultiple = isMultipleCorrect(question);
            return (
              <div key={question.id} className="mb-8">
                <h2 className="font-semibold text-lg mb-2">
                  {idx + 1}. {question.contents}
                </h2>
                <ul className="space-y-2">
                  {question.answers.map((answer) => (
                    <li key={answer.id}>
                      <label className="flex items-center gap-2">
                        <input
                          type={isMultiple ? "checkbox" : "radio"}
                          name={`question-${question.id}`}
                          value={answer.id}
                          disabled={oceniono}
                          checked={
                            isMultiple
                              ? (answers[question.id] || []).includes(answer.id)
                              : answers[question.id] === answer.id
                          }
                          onChange={() =>
                            handleAnswerChange(question.id, answer.id, isMultiple)
                          }
                        />
                        {answer.contents}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

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
                Wynik: {wynik} / {quiz.length} (
                {Math.round((wynik / quiz.length) * 100)}%)
              </p>

              {wynik / quiz.length >= 0.8 ? (
                <div className="space-y-4">
                  <p className="text-green-400 font-semibold">
                    Gratulacje! Zaliczyłeś quiz 🎉
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <a
                      href={`/courses/${courseId}`}
                      className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
                    >
                      Wróć do kursu
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-red-400 font-semibold">
                    Niestety, nie udało się zdać. Potrzebujesz co najmniej 80%, by móc zdać. 😢
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      className="px-5 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black"
                      onClick={() => {
                        setOceniono(false);
                        setAnswers({});
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