"use client";
import { useEffect } from "react";
import Link from "next/link";


export default function ErrorRej({ msg, gif = "/oops1.gif", onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900/95 text-white rounded-xl shadow-2xl
                   w-[90%] max-w-xl p-8 md:p-10 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl leading-none hover:text-gray-300"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-center">Ups! Coś poszło nie tak</h2>

        <img
    src={gif}
    alt="Błąd"
    className="mx-auto w-40 h-40 md:w-100 md:h-55 object-contain"
  />

        <p className="text-center text-lg">{msg}</p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded"
          >
            Spróbuj ponownie
          </button>
          {gif === "/oops1.gif" && (
    <Link href="/logowanie" className="w-full sm:w-auto">
      <span className="block text-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
        Zaloguj się
      </span>
    </Link>
  )}
  {gif === "/oops.gif" && (
            <Link href="/rejestracja" className="w-full sm:w-auto">
            <span className="block text-center bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded">
              Zarejestruj się
            </span>
          </Link>
          )}
        </div>
      </div>
    </div>
  );
}
