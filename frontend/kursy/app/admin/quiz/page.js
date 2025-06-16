"use client";

import { useEffect, useState } from "react";
import Brama from "@/app/components/auth/Brama";
import {
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEdit,
  FaCheck,
} from "react-icons/fa";

function pustaOdpowiedź() {
  return { tresc: "", poprawna: false };
}

function pustePytanie() {
  return { tresc: "", odpowiedzi: [pustaOdpowiedź(), pustaOdpowiedź()] };
}

export default function KreatorQuizu() {
  const [pytania, setPytania]     = useState([]);
  const [podgląd, setPodgląd]     = useState(false);
  const [błąd, setBłąd]           = useState("");
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
        async function fetchData(){
          setError("");
          try {
    
              const response = await fetch("http://localhost:8080/lesson/getWithoutQuiz", {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
    
              if (!response.ok) {
                  throw new Error(`Błąd `);
              }
              const data = await response.json();
              setLessons(data);
    
          } catch (err) {
              setError(err.message);
          }
        }
        fetchData();
              }, []);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      pytania.forEach(async pytanie => {
        try {
              const contents = pytanie.tresc;
              const lessonId = lesson;
              const response = await fetch(`http://localhost:8080/question/add`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ contents, lessonId }),
              });
  
              if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(`Błąd ${response.status}: ${errorText}`);
              }

              const text = await response.text();
              const questionId = parseInt(text, 10);
              let i = 0;
              pytanie.odpowiedzi.forEach(async odpowiedz => {
                i++;
                try {
                  const contents = odpowiedz.tresc;
                  const isCorrect = !!odpowiedz.poprawna;
                  const response1 = await fetch(`http://localhost:8080/answer/add`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ contents, isCorrect: !!odpowiedz.poprawna, questionId }),
                  });
      
                  if (!response1.ok) {
                      const errorText = await response1.text();
                      throw new Error(`Błąd ${response1.status}: ${errorText}`);
                  }

                  console.log("Wysyłana odpowiedź:", {
                    contents,
                    isCorrect: !!odpowiedz.poprawna,
                    questionId
                  });

                } catch (err) {
                  setError(err.message);
                }
                
              });
  
          } catch (err) {
              setError(err.message);
          }
      })
      //window.location.reload();
      
    };

  const dodajPytanie = () => setPytania([...pytania, pustePytanie()]);

  const usuńPytanie = (idx) =>
    setPytania(pytania.filter((_, i) => i !== idx));

  const przesuńPytanie = (idx, dir) => {
    const kopia = [...pytania];
    const swap  = idx + dir;
    if (swap < 0 || swap >= kopia.length) return;
    [kopia[idx], kopia[swap]] = [kopia[swap], kopia[idx]];
    setPytania(kopia);
  };

  const aktualizujPytanie = (idx, dane) =>
    setPytania((prev) => prev.map((p, i) => (i === idx ? dane : p)));

  const otwórzPodgląd = () => {
    const niepoprawne = pytania.find(
      (p) =>
        !p.tresc.trim() ||
        p.odpowiedzi.some((o) => !o.tresc.trim()) ||
        !p.odpowiedzi.some((o) => o.poprawna)
    );
    if (niepoprawne) {
      setBłąd("Każde pytanie i odpowiedź musi być uzupełnione; zaznacz co najmniej jedną odpowiedź jako poprawną.");
      return;
    }
    if (lesson<1) {
      setBłąd("Wybierz lekcję.");
      return;
    }
    setBłąd("");
    setPodgląd(true);
  };

  const renderujOdpowiedźEdytor = (pidx, oidx, odp) => (
    <div key={oidx} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={odp.poprawna}
        onChange={(e) => {
          const k = [...pytania];
          k[pidx].odpowiedzi[oidx].poprawna = e.target.checked;
          setPytania(k);
        }}
      />
      <input
        type="text"
        value={odp.tresc}
        placeholder={`Odpowiedź ${oidx + 1}`}
        onChange={(e) => {
          const k = [...pytania];
          k[pidx].odpowiedzi[oidx].tresc = e.target.value;
          setPytania(k);
        }}
        className="flex-1 bg-white/10 border border-white/30 rounded px-2 py-1 text-white"
      />
      <button
        onClick={() => {
          const k = [...pytania];
          k[pidx].odpowiedzi.splice(oidx, 1);
          setPytania(k);
        }}
        className="text-red-400"
      >
        <FaTrash />
      </button>
    </div>
  );

  const renderujPytanieEdytor = (pyt, idx) => (
    <div key={idx} className="bg-white/10 p-4 rounded border border-white/20 space-y-3">
      <div className="flex justify-between">
        <span className="font-semibold">Pytanie {idx + 1}</span>
        <div className="flex gap-2 text-sm">
          <button onClick={() => przesuńPytanie(idx, -1)}><FaArrowUp /></button>
          <button onClick={() => przesuńPytanie(idx, 1)} ><FaArrowDown/></button>
          <button onClick={() => usuńPytanie(idx)} className="text-red-400"><FaTrash/></button>
        </div>
      </div>

      <textarea
        value={pyt.tresc}
        onChange={(e) => aktualizujPytanie(idx, { ...pyt, tresc: e.target.value })}
        placeholder="Treść pytania..."
        className="w-full bg-white/20 p-2 rounded text-black"
        rows={2}
      />

      <div className="space-y-2">
        {pyt.odpowiedzi.map((o, oidx) => renderujOdpowiedźEdytor(idx, oidx, o))}
      </div>

      <button
        onClick={() => {
          const k = [...pytania];
          k[idx].odpowiedzi.push(pustaOdpowiedź());
          setPytania(k);
        }}
        className="mt-2 flex items-center gap-2 bg-white/20 px-2 py-1 rounded text-sm"
      >
        <FaPlus /> Dodaj odpowiedź
      </button>
    </div>
  );

  const renderujPodgląd = (pyt, idx) => (
    <div key={idx} className="mb-8">
      <h2 className="font-semibold mb-2">
        {idx + 1}. {pyt.tresc}
      </h2>
      <ul className="space-y-1">
        {pyt.odpowiedzi.map((o, i) => (
          <li key={i} className="flex items-center gap-2">
            <FaCheck
              className={`${
                o.poprawna ? "text-green-400" : "opacity-0"
              }`}
            />
            {o.tresc}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Brama>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-32 pb-16"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80" />
        <div className="relative z-10 container mx-auto px-4 text-white max-w-4xl space-y-6">

          <h1 className="text-4xl font-bold">Kreator quizu</h1>
          
          {!podgląd && (
            <>
            <h1 className="text-1xl font-bold">Wybierz lekcje</h1>
            <select className="text-white block w-full max-w-xs bg-white/20 backdrop-blur-sm text-black border border-white/30 rounded-lg px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500" name="kursy" id="kursy"
                onChange={(e) => setLesson(e.target.value)}
                value={lesson}
              >
                <option value="0" disabled hidden className="text-gray">--- Wybierz Lekcje ---</option>
                {lessons.map((lessonMaped) => (
                  <option key={lessonMaped.id} value={lessonMaped.id} className="text-black">{lessonMaped.name}</option>
                ))}
              </select>
              <button
                onClick={dodajPytanie}
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded"
              >
                <FaPlus /> Dodaj pytanie
              </button>

              <div className="space-y-4">{pytania.map(renderujPytanieEdytor)}</div>

              {błąd && <p className="text-red-400">{błąd}</p>}

              <button
                onClick={otwórzPodgląd}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mt-6 inline-flex items-center gap-2"
              >
                <FaEye /> Podgląd
              </button>
            </>
          )}

          {podgląd && (
            <>
              <div>
                <h2 className="text-2xl font-bold">Lekcja: {lessons.find(lessonFind => lessonFind.id == lesson)?.name || "Nieznana Lekcja"}</h2>
              </div>
              {pytania.map(renderujPodgląd)}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setPodgląd(false)}
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded font-semibold inline-flex items-center gap-2"
                >
                  <FaEdit /> Wróć do edycji
                </button>

                <button

                  className="bg-blue-500 opacity-60 px-6 py-3 rounded font-semibold inline-flex items-center gap-2"
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
