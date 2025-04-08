"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from "react-icons/fa";

export default function Banned() {
    const date_start = '2025-04-01';
    const date_end = '2025-04-15';
    const reason = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const userName = 'Filip';
    return (
        <section className="flex w-full h-screen">
          <div className="w-full md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-8">
            <div className="max-w-md mx-auto w-full">
            <p className="text-lg text-red-100 leading-relaxed">
                Twoje konto zostało{" "}
                <span className="font-semibold text-red-300">zablokowane</span>
                <br />
                w okresie od{" "}
                <span className="text-white font-medium">{date_start}</span> do{" "}
                <span className="text-white font-medium">{date_end}</span>.
            </p>

        <div className="bg-red-800/20 border border-red-500 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-2 mb-2">
            <FaExclamationTriangle className="text-red-400 w-5 h-5 mt-0.5" />
            <p className="font-semibold text-red-300">Powód blokady:</p>
          </div>
          <p className="text-sm text-red-100 leading-relaxed">{reason}</p>
        </div>

        <p className="text-sm text-red-200">
          Jeśli uważasz, że to pomyłka, skontaktuj się z administracją.
        </p>

        <button className="mt-6 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition w-full shadow-sm">
            Wróć do strony głównej
        </button>
        </div>
        </div>
    
          <div
      className="hidden md:flex w-1/2 bg-cover bg-center text-white relative"
      style={{ backgroundImage: 'url("/tloLogiRej.png")' }}
    >
      <div className="absolute inset-0 bg-black/50" />
    
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center p-10 space-y-4 max-w-md ml-20">
          <h2 className="text-3xl font-bold">
            {userName}
          </h2>
          <p>
            Twoje konto zostało tymczasowo zablokowane.
          </p>
          <div className="flex flex-col items-center space-y-2">
            <img
              src="logo3.png"
              alt="logo"
              className="w-32 h-32 rounded-full"
            />
            <span className="text-base opacity-90">
            Wrócisz do pełnego dostępu po zakończeniu okresu blokady.
            </span>
          </div>
        </div>
      </div>
    </div>
    
        </section>
      );
    
}