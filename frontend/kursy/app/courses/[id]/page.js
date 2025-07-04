'use client'

import Brama from "@/app/components/auth/Brama";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { FaCheckCircle, FaRegCheckCircle } from "react-icons/fa";

export default function CourseDetails({ params }) {
  const resolvedParams = use(params);

  //const { courseId } = resolvedParams.id || {};
  const [courseData, setCourseData] = useState([]);
  const [finishedLessons, setFinishedLessons] = useState([]);
  const [finishedCourses, setFinishedCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [comments, setComments] = useState([]);
  const [contents, setContents] = useState([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState(typeof window !== "undefined" ? localStorage.getItem("email") || "" : "");
  const [courseId, setCourseId] = useState(resolvedParams.id);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  useEffect(() => {
    async function fetchData() {
      setError(""); 
      try {

        const response = await fetch(`http://localhost:8080/course/${courseId}/lessons`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Błąd `);
        }
        const data = await response.json();
        setCourseData(data);

        const response2 = await fetch(`http://localhost:8080/${email}/finished-lessons-ids`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response2.ok) {
          throw new Error(`Błąd `);
        }
        const data2 = await response2.json();
        setFinishedLessons(data2);

        const response3 = await fetch(`http://localhost:8080/course/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response3.ok) {
          throw new Error(`Błąd `);
        }
        const data3 = await response3.json();

        setCourse(data3);

        const response4 = await fetch(`http://localhost:8080/comment/${courseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response4.ok) {
          throw new Error(`Błąd `);
        }
        const data4 = await response4.json();

        setComments(data4);
        

        const response5 = await fetch(`http://localhost:8080/${email}/finished-course-ids`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response5.ok) {
          throw new Error(`Błąd `);
        }
        const data5 = await response5.json();

        setFinishedCourses(data5);


        
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();

  }, []);

  useEffect(() => {
    if (!email || comments.length === 0) return;

    const user_com = comments.find(comment => comment.user.email === email);
    if (user_com) {
      setIsEditing(true);
      setContents(user_com.contents);
      setRating(user_com.rating);
    }
  }, [comments, email]);

  //console.log(finishedCourses);

  const finishedSet = new Set(finishedLessons.map(String));
  const completedSteps = courseData.filter((lesson) =>
    finishedSet.has(String(lesson.id))
  ).length;
  let progressPercentage = (completedSteps / courseData.length) * 100;
  if (courseData.length === 0) {
    progressPercentage = 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const course_id = courseId;
      const user_email = email;
      const response = await fetch("http://localhost:8080/comment/add", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ contents, course_id, user_email, rating }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
      }
      
      const anwser = await response.text();
      if(anwser){
        console.log(anwser);
        window.location.reload();
      }

    } catch (err) {
      setErrorTop(err.message);
    }
  }


  return (
    <Brama>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >


        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4">

          <h1 className="text-4xl font-bold text-white mb-4">{course.name}</h1>
          <div className="mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < course.rating ? "text-yellow-400" : "text-gray-400"}
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

              {completedSteps} z {courseData.length} lekcji ukończonych (
              {Math.round(progressPercentage)}%)
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30 text-white">
            <h2 className="text-2xl font-semibold mb-4">Lekcje:</h2>
            <ul className="space-y-2">
              {courseData.map((lesson) => {
                const isCompleted = finishedSet.has(String(lesson.id));
                return (
                  <li
                    key={lesson.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center border-b border-white/30 py-3 gap-4"
                  >
                    <div>
                      <p className="font-semibold">{lesson.name}</p>
                      <p className="text-sm text-gray-200">{lesson.description}</p>
                    </div>

                    <Link
                      href={`/courses/${course.id}/${lesson.id}`}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition"
                    >
                      Przejdź
                    </Link>

                    <div className="justify-self-end">
                      {isCompleted ? (
                        <FaCheckCircle className="text-green-500 text-2xl" />
                      ) : (
                        <FaRegCheckCircle className="text-gray-500 text-2xl" />
                      )}
                    </div>
                  </li>
                );
              })}
              {courseData.length === 0 && (
                <li className="grid grid-cols-[1fr_auto_auto] items-center border-b border-white/30 py-3 gap-4">
                  Brak lekcji do wyświetlenia.
                </li>
              )}

            </ul>
          </div>

          <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30 text-white mt-10">
            <h2 className="text-2xl font-semibold mb-4">Komentarze:</h2>
            {finishedCourses.includes(course.id) && (
              <div className="mb-4">
                <label htmlFor="contents" className="block font-semibold mb-2">
                  {isEditing ? 'Edytuj komentarz:' : 'Skomentuj:'}
                </label>
                <div className="flex space-x-1 mb-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starIndex = index + 1;
                    const isActive = hoverRating >= starIndex || (!hoverRating && rating >= starIndex);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setRating(starIndex)}
                        onMouseEnter={() => setHoverRating(starIndex)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`
                          text-2xl
                          ${isActive ? 'text-yellow-400' : 'text-gray-400'}
                          hover:text-yellow-300
                          transition-colors duration-200
                        `}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>


                <textarea
                  id="contents"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                  required
                  className="bg-white/20 w-full"
                />
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition-colors duration-200 font-semibold mb-4"
                >
                  {isEditing ? 'Zapisz zmiany' : 'Dodaj komentarz'}
                </button>
              </div>
            )}
            <ul className="space-y-2">
              {comments.map((comment) => {
                return (
                  <li
                    key={comment.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center border-b border-white/30 py-3 gap-4"
                  >
                    <div>
                      <p className="text-sm text-gray-200 flex justify-between">
                        <span>{comment.user.username}</span>
                        <span>
                          {new Date(comment.create_date).toLocaleString('pl-PL', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          <br />
                          <span className="flex items-center space-x-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-500"}>
                                ★
                              </span>
                            ))}
                          </span>
                        </span>
                      </p>
                      <p className="font-semibold">{comment.contents}</p>

                    </div>
                  </li>
                );
              })}
              {comments.length === 0 && (
                <li className="grid grid-cols-[1fr_auto_auto] items-center border-b border-white/30 py-3 gap-4">
                  Brak komentarzy do wyświetlenia.
                </li>
              )}

            </ul>
          </div>

        </div>
      </section>
    </Brama>

  );
}
