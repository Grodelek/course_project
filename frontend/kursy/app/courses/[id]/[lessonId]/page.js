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
        {
          id: 2,
          tytul: "Struktura dokumentu HTML",
          czas: "45m",
          sektory: [
            { typ: "obraz", wartosc: "https://how2html.pl/wp-content/uploads/2014/08/struktura-dokumentu-html.jpg", alt: "Schemat dokumentu HTML" },
            { typ: "tekst", wartosc: "Każdy dokument HTML rozpoczyna się deklaracją <!DOCTYPE html>, po której następują elementy <html>, <head> i <body>." },
            { typ: "film", wartosc: "https://www.youtube.com/embed/kUMe1FH4CHE" },
          ],
        },
        {
          id: 3,
          tytul: "Podstawowe tagi HTML",
          czas: "1h",
          sektory: [
            { typ: "film", wartosc: "https://www.youtube.com/embed/UB1O30fR-EE" },
            { typ: "tekst", wartosc: "Do najczęściej używanych znaczników należą <h1>–<h6> dla nagłówków, <p> dla akapitów, <a> dla linków oraz <img> do osadzania obrazów." },
            { typ: "obraz", wartosc: "https://strategiczni.pl/wp-content/uploads/2021/07/naglowki-html.jpg", alt: "Najważniejsze tagi HTML" },
          ],
        },
        {
          id: 4,
          tytul: "Formularze w HTML",
          czas: "50m",
          sektory: [
            { typ: "tekst", wartosc: "Formularze pozwalają użytkownikom przesyłać dane na serwer. Podstawą jest element <form> oraz pola <input>, <textarea>, <select>." },
            { typ: "obraz", wartosc: "https://ferrante.pl/books/html/img/chapter9/form-blocks.png", alt: "Przykładowy formularz" },
            { typ: "film", wartosc: "https://www.youtube.com/embed/Ss6cPGRcvCE" },
          ],
        },
        {
          id: 5,
          tytul: "Zaawansowane techniki HTML",
          czas: "1h15m",
          sektory: [
            { typ: "tekst", wartosc: "Poznasz elementy semantyczne (<header>, <main>, <article>, <section>), a także multimedia (<video>, <audio>) i atrybuty ARIA." },
            { typ: "film", wartosc: "https://www.youtube.com/embed/DPnqb74Smug" },
            { typ: "obraz", wartosc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6935wo8bLZh5FeafJEffqWKDOpNpx6UE5bg&s", alt: "HTML5 Logo" },
          ],
        },
      ],
    };
  }

export default function StronaLekcji({ params }) {
  const { id: idKursu, lessonId: idLekcji } = use(params);

  const kurs = pobierzKurs(idKursu);
  const indeksLekcji = kurs.lekcje.findIndex((l) => l.id === Number(idLekcji));
  const lekcja = kurs.lekcje[indeksLekcji];

  if (!lekcja) {
    return (
      <Brama>
        <div className="flex items-center justify-center min-h-screen text-white">
          <h1 className="text-3xl">Lekcja nie została znaleziona.</h1>
        </div>
      </Brama>
    );
  }

  const poprzedniaLekcja = kurs.lekcje[indeksLekcji - 1];
  const nastepnaLekcja = kurs.lekcje[indeksLekcji + 1];

  const kluczStorage = `kurs:${kurs.id}:lekcja:${lekcja.id}:ukonczona`;
  const [ukonczona, setUkonczona] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setUkonczona(localStorage.getItem(kluczStorage) === "1");
  }, [kluczStorage]);

  const toggleUkonczona = () => {
    const nowa = !ukonczona;
    setUkonczona(nowa);
    localStorage.setItem(kluczStorage, nowa ? "1" : "0");
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  };

  const renderSektor = (sektor, idx) => {
    switch (sektor.typ) {
      case "tekst":
        return <p key={idx}>{sektor.wartosc}</p>;
      case "obraz":
        return (
          <img
            key={idx}
            src={sektor.wartosc}
            alt={sektor.alt || "obraz"}
            className="my-6 rounded-lg shadow-lg mx-auto"
          />
        );
      case "film":
        return (
          <div key={idx} className="my-6 aspect-video">
            <iframe
              src={sektor.wartosc}
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
              href={`/courses/${kurs.id}`}
              className="text-sm hover:underline flex items-center gap-1"
            >
              <FaArrowLeft /> (Wróć do kursu)
            </Link>
          </div>

          <h1 className="text-4xl font-bold mb-2">{lekcja.tytul}</h1>
          <p className="text-gray-200 mb-8 text-sm">Czas trwania: {lekcja.czas}</p>

          <article className="prose prose-invert max-w-none leading-relaxed">
            {lekcja.sektory.map(renderSektor)}
          </article>

          <button
            onClick={toggleUkonczona}
            className={`mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-md transition
              ${ukonczona ? "bg-green-600 hover:bg-green-700" : "bg-white/20 hover:bg-white/30"}`}
          >
            {ukonczona && <FaCheck />}
            {ukonczona ? "Lekcja ukończona" : "Oznacz jako ukończoną"}
            {flash && <span className="ml-2 text-xs">✔︎</span>}
          </button>

          <div className="flex justify-between mt-12">
            {poprzedniaLekcja ? (
              <Link
                href={`/courses/${kurs.id}/${poprzedniaLekcja.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                <FaArrowLeft /> {poprzedniaLekcja.tytul}
              </Link>
            ) : (
              <span />
            )}

            {nastepnaLekcja ? (
              <Link
                href={`/courses/${kurs.id}/${nastepnaLekcja.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                {nastepnaLekcja.tytul} <FaArrowRight />
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
