"use client";
import Link from "next/link";
import { useState } from "react";

export default function NotLoggedIn(){
    const videos = [
        "https://www.youtube.com/embed/0M1C9yEzplI?autoplay=1&mute=1",
        "https://www.youtube.com/embed/20pvrDle36o?autoplay=1&mute=1",
        "https://www.youtube.com/embed/D89Dgg32yLk?autoplay=1&mute=1",
    ];

    const [current, setCurrent] = useState(0);

    const nextVideo = () => {
    setCurrent((prev) => (prev + 1) % videos.length);
    };

    const prevVideo = () => {
    setCurrent((prev) => (prev - 1 + videos.length) % videos.length);
    };

    return (
    <section
          className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center"
          style={{ backgroundImage: 'url("/tloStart.png")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80" />

          <div className="relative z-10 text-center text-white px-6 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Witaj na naszej platformie kursów!
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Zdobądź nowe umiejętności i rozwijaj swoją karierę dzięki naszym kursom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rejestracja"
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-semibold transition"
              >
                Zarejestruj się
              </Link>
              <Link
                href="/logowanie"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold transition"
              >
                Zaloguj się
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-12 w-full max-w-4xl px-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                key={current}
                width="100%"
                height="100%"
                src={videos[current]}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <button
              onClick={prevVideo}
              className="absolute left-6 top-1/2 z-20 transform -translate-y-1/2
                        bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-90
                        rounded-full p-3 text-2xl shadow-lg transition duration-200 ease-in-out hover:scale-105"
            >
              &#8592;
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-6 top-1/2 z-20 transform -translate-y-1/2
                        bg-gray-800 bg-opacity-70 text-white hover:bg-opacity-90
                        rounded-full p-3 text-2xl shadow-lg transition duration-200 ease-in-out hover:scale-105"
            >
              &#8594;
            </button>

            <div className="flex justify-center mt-4 space-x-2">
              {videos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3 rounded-full ${
                    current === index ? "bg-blue-600" : "bg-gray-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </section>
    );
}