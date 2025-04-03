"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Logowanie() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  //wysłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
        setError("");
        try {

            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Błąd ${response.status}: ${errorText}`);
            }
            const token = await response.text();

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("username", email);
                router.push('/');
            } else {
                throw new Error("Brak tokena w odpowiedzi serwera");
            }

        } catch (err) {
            setError(err.message);
        }
  };

  return (
    <section className="flex w-full h-screen">
      <div className="w-full md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6">Zaloguj się</h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded font-semibold transition">
              Zaloguj się z Google
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded font-semibold transition">
              Zaloguj się z Apple
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-2">
              Adres e-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="nazwa@domena.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 text-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-semibold mb-2">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 text-gray-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition-colors duration-200 font-semibold mb-4"
          >
            Zaloguj się
          </button>

          <p className="text-center text-gray-400">
            Nie masz jeszcze konta?{" "}
            <Link href="/rejestracja" className="text-white font-semibold hover:underline">
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex w-1/2 bg-cover bg-center text-white relative"
        style={{ backgroundImage: 'url("/tloLogiRej.png")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center p-10 space-y-4 max-w-md ml-20">
          <h2 className="text-3xl font-bold mb-4">Witamy ponownie!</h2>
          <p className="mb-6 max-w-md">
            Cieszymy się, że wracasz. Zaloguj się, aby kontynuować korzystanie z naszej platformy i rozwijać swoje umiejętności.
          </p>
          <div className="flex flex-col items-center space-y-2">
          <img
          src="logo3.png"
          alt="logo"
          className="w-32 h-32 rounded-full"
          />
            <span className="text-sm opacity-90">
              Dołącz do tysięcy zadowolonych użytkowników!
            </span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
