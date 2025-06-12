"use client";

import { useState } from "react";
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
  tekst:  { typ: "tekst",  wartosc: "" },
  obraz:  { typ: "obraz",  wartosc: "", alt: "" },
  wideo:  { typ: "wideo",  wartosc: "" },
};

export default function KreatorLekcji() {
  const [bloki, setBloki] = useState([]);
  const [podglad, setPodglad] = useState(false);
  const [blad, setBlad] = useState("");

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
        (b.typ === "tekst" && !b.wartosc.trim()) ||
        (b.typ === "obraz" && !b.wartosc.trim()) ||
        (b.typ === "wideo" && !b.wartosc.trim())
    );
    if (pusty) {
      setBlad("Uzupełnij treść wszystkich bloków przed podglądem.");
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

      {blok.typ === "tekst" && (
        <textarea
          value={blok.wartosc}
          onChange={(e) => aktualizuj(idx, "wartosc", e.target.value)}
          className="w-full bg-white/20 p-2 rounded text-black"
          rows={3}
        />
      )}

      {blok.typ === "obraz" && (
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

      {blok.typ === "wideo" && (
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

  /* ---------- RENDER BLOKU (PODGLĄD) ---------- */
  const renderujPodglad = (blok, idx) => {
    switch (blok.typ) {
      case "tekst":
        return (
          <p key={idx} className="my-4 whitespace-pre-line">
            {blok.wartosc}
          </p>
        );
      case "obraz":
        return (
          <img
            key={idx}
            src={blok.wartosc}
            alt={blok.alt}
            className="my-6 rounded-lg mx-auto"
          />
        );
      case "wideo":
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
          <select className="block w-full max-w-xs bg-white/20 backdrop-blur-sm text-black border border-white/30 rounded-lg px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500" name="kursy" id="kursy">
          </select>
          {!podglad && (
            <>
              {/* PRZYCISKI DODAWANIA */}
              <div className="flex gap-4">
                <button
                  onClick={() => dodajBlok("tekst")}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded"
                >
                  <FaPlus />
                  Tekst
                </button>
                <button
                  onClick={() => dodajBlok("obraz")}
                  className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded"
                >
                  <FaPlus />
                  Obraz
                </button>
                <button
                  onClick={() => dodajBlok("wideo")}
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
                {bloki.map(renderujPodglad)}
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
                  disabled
                  className="bg-blue-500 opacity-60 px-6 py-3 rounded font-semibold inline-flex items-center gap-2 cursor-not-allowed"
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
