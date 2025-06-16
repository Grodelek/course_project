"use client";

import { useEffect, useState } from "react";
import Brama from "@/app/components/auth/Brama";
import {
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaPlus,
  FaEye,
  FaEdit,
} from "react-icons/fa";

const pusteBloki = {
  text:  { typ: "text",  wartosc: "" },
  image:  { typ: "image",  wartosc: "", alt: "" },
  video:  { typ: "video",  wartosc: "" },
};

export default function KreatorLekcji() {
  const [bloki, setBloki] = useState([]);
  const [podglad, setPodglad] = useState(false);
  const [blad, setBlad] = useState("");
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [nazwaLekcji, setNazwaLekcji] = useState("");
  const [dlugosc, setDlugosc] = useState("");
  const [kurs, setKurs] = useState(0);

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
            setCourses(data);
  
        } catch (err) {
            setError(err.message);
        }
      }
      fetchData();
            }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
              const name = nazwaLekcji;
              const description = dlugosc;
              const courseId = kurs;
              const response = await fetch(`http://localhost:8080/lesson/add?courseId=${courseId}`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name, description }),
              });
  
              if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Błąd ${response.status}: ${errorText}`);
              }

              const text = await response.text();
              const lessonId = parseInt(text, 10);
              let i = 0;
              bloki.forEach(async blok => {
                i++;
                try {
                  const type = blok.typ;
                  const value = blok.wartosc;
                  const alternative = blok.alt;
                  const place = i;
                  const response1 = await fetch(`http://localhost:8080/sector/add`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ type, value, alternative, place, lessonId }),
                  });
      
                  if (!response1.ok) {
                      const errorText = await response1.text();
                      throw new Error(`Błąd ${response1.status}: ${errorText}`);
                  }

                } catch (err) {
                  setError(err.message);
                }
                
              });
  
          } catch (err) {
              setError(err.message);
          }
          window.location.reload();
    };

  /* ---------- OPERACJE NA BLOKACH ---------- */
  const dodajBlok = (rodzaj) =>
    setBloki([...bloki, { ...pusteBloki[rodzaj] }]);

  const przesun = (idx, dir) => {
    const kopia = [...bloki];
    const zamiana = idx + dir;
    if (zamiana < 0 || zamiana >= kopia.length) return;
    [kopia[idx], kopia[zamiana]] = [kopia[zamiana], kopia[idx]];
    setBloki(kopia);
  };

  const usun = (idx) => setBloki(bloki.filter((_, i) => i !== idx));

  const aktualizuj = (idx, pole, wartosc) => {
    setBloki((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, [pole]: wartosc } : b))
    );
  };

  /* ---------- WALIDACJA I PODGLĄD ---------- */
  const otworzPodglad = () => {
    const pusty = bloki.find(
      (b) =>
        (b.typ === "text" && !b.wartosc.trim()) ||
        (b.typ === "image" && !b.wartosc.trim()) ||
        (b.typ === "video" && !b.wartosc.trim())
    );
    if (pusty) {
      setBlad("Uzupełnij treść wszystkich bloków przed podglądem.");
      return;
    }
    if (nazwaLekcji==""){
      setBlad("Uzupełnij nazwę lekcji przed podglądem.");
      return;
    }
    if (kurs == 0){
      setBlad("Wybierz kurs przed podglądem.");
      return;
    }
    if (dlugosc == ""){
      setBlad("Podaj długość lekcji przed podglądem.");
      return;
    }
    setBlad("");
    setPodglad(true);
  };

  /* ---------- RENDER BLOKU (EDYCJA) ---------- */
  const renderujEdytor = (blok, idx) => (
    <div
      key={idx}
      className="bg-white/10 p-4 rounded-lg space-y-2 border border-white/20"
    >
      <div className="flex justify-between">
        <span className="capitalize font-semibold">{blok.typ}</span>
        <div className="flex gap-2 text-sm">
          <button onClick={() => przesun(idx, -1)}>
            <FaArrowUp />
          </button>
          <button onClick={() => przesun(idx, 1)}>
            <FaArrowDown />
          </button>
          <button onClick={() => usun(idx)} className="text-red-400">
            <FaTrash />
          </button>
        </div>
      </div>

      {blok.typ === "text" && (
        <textarea
          value={blok.wartosc}
          onChange={(e) => aktualizuj(idx, "wartosc", e.target.value)}
          className="w-full bg-white/20 p-2 rounded text-black"
          rows={3}
        />
      )}

      {blok.typ === "image" && (
        <>
          <input
            type="text"
            placeholder="URL obrazu"
            value={blok.wartosc}
            onChange={(e) => aktualizuj(idx, "wartosc", e.target.value)}
            className="w-full bg-white/20 p-2 rounded text-black"
          />
          <input
            type="text"
            placeholder="Opis alternatywny"
            value={blok.alt}
            onChange={(e) => aktualizuj(idx, "alt", e.target.value)}
            className="w-full bg-white/20 p-2 rounded text-black"
          />
        </>
      )}

      {blok.typ === "video" && (
        <input
          type="text"
          placeholder="Embed URL (YouTube, Vimeo...)"
          value={blok.wartosc}
          onChange={(e) => aktualizuj(idx, "wartosc", e.target.value)}
          className="w-full bg-white/20 p-2 rounded text-black"
        />
      )}
    </div>
  );

  const renderujPodglad = () => {
    return (
    <div>
      <h1 className="text-4xl font-bold">{nazwaLekcji}</h1>
      <h2 className="text-2xl font-bold">Kurs: {courses.find(course => course.id == kurs)?.name || "Nieznany kurs"}</h2>
      <h3 className="text-1m font-bold">Długość: {dlugosc}</h3>
    </div>
    )
    
    
  }

  /* ---------- RENDER BLOKU (PODGLĄD) ---------- */
  const renderujPodgladBloki = (blok, idx) => {
    switch (blok.typ) {
      case "text":
        return (
          <p key={idx} className="my-4 whitespace-pre-line">
            {blok.wartosc}
          </p>
        );
      case "image":
        return (
          <img
            key={idx}
            src={blok.wartosc}
            alt={blok.alt}
            className="my-6 rounded-lg mx-auto"
          />
        );
      case "video":
        return (
          <div key={idx} className="my-6 aspect-video">
            <iframe
              src={blok.wartosc}
              className="w-full h-full rounded-lg"
              allowFullScreen
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
        className="relative w-full min-h-screen bg-cover bg-center pt-32 pb-16"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80" />
        <div className="relative z-10 container mx-auto px-4 text-white max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold">Kreator lekcji</h1>
          <h1 className="text-1xl font-bold">Wybierz kurs</h1>
          
          {!podglad && (
            <>
              <select className="text-white block w-full max-w-xs bg-white/20 backdrop-blur-sm text-black border border-white/30 rounded-lg px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500" name="kursy" id="kursy"
                onChange={(e) => setKurs(e.target.value)}
                value={kurs}
              >
                <option value="0" disabled hidden className="text-gray">--- Wybierz kurs ---</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id} className="text-black">{course.name}</option>
                ))}
              </select>
              <h1 className="text-1xl font-bold">Nazwa lekcji</h1>
              <input
                type="text"
                placeholder="Nazwa"
                value={nazwaLekcji}
                onChange={(e) => setNazwaLekcji(e.target.value)}
                className="w-full bg-white/20 p-2 rounded text-black"
              />
              <h1 className="text-1xl font-bold">Długość</h1>
              <input
                type="text"
                placeholder="Długość (np. 1h15m)"
                value={dlugosc}
                onChange={(e) => setDlugosc(e.target.value)}
                className="w-full bg-white/20 p-2 rounded text-black"
              />
              {/* PRZYCISKI DODAWANIA */}
              <div className="flex gap-4">
                <button
                  onClick={() => dodajBlok("text")}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded"
                >
                  <FaPlus />
                  Tekst
                </button>
                <button
                  onClick={() => dodajBlok("image")}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded"
                >
                  <FaPlus />
                  Obraz
                </button>
                <button
                  onClick={() => dodajBlok("video")}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded"
                >
                  <FaPlus />
                  Wideo
                </button>
              </div>

              <div className="space-y-4">{bloki.map(renderujEdytor)}</div>

              {blad && <p className="text-red-400">{blad}</p>}

              <button
                onClick={otworzPodglad}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mt-6 inline-flex items-center gap-2"
              >
                <FaEye />
                Podgląd
              </button>
            </>
          )}

          {podglad && (
            <>
              <article className="prose prose-invert max-w-none">
                {renderujPodglad()}
                {bloki.map(renderujPodgladBloki)}
              </article>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setPodglad(false)}
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded font-semibold inline-flex items-center gap-2"
                >
                  <FaEdit />
                  Wróć do edycji
                </button>

                <button
                  className="bg-blue-500 px-6 py-3 rounded font-semibold inline-flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  Wyślij do bazy (wkrótce)
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </Brama>
  );
}
