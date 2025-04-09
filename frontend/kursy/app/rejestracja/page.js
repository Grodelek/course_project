"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function Rejestracja() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  //wysłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
            localStorage.setItem("email", email);
            router.push('/authenticate');
            const response = await fetch("http://localhost:8080/register", {
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

        } catch (err) {
            setError(err.message);
        }
  };

  return (
    <section className="flex w-full h-screen">
      <div className="w-full md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6">Zarejestruj się</h1>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded font-semibold transition">
              Zarejestruj się z Google
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded font-semibold transition">
              Zarejestruj się z Apple
            </button>
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block font-semibold mb-2">
              Jak Cię nazywać?
            </label>
            <input
              id="username"
              type="text"
              placeholder="np. Jan Kowalski"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 text-black-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
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
              className="w-full p-2 text-black-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
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
              className="w-full p-2 text-black-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4 text-sm text-gray-400">
            Rejestrując się, akceptujesz nasz{" "}
            <span className="underline">Regulamin</span> i{" "}
            <span className="underline">Politykę Prywatności</span>.
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded transition-colors duration-200 font-semibold mb-4"
          >
            Utwórz konto
          </button>

          <p className="text-center text-gray-400">
            Masz już konto?{" "}
            <Link href="/logowanie" className="text-white font-semibold hover:underline">
              Zaloguj się
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
      <h2 className="text-3xl font-bold">
        Poznaj świat najlepszych kursów online
      </h2>
      <p>
        Ucz się od najlepszych ekspertów i rozwijaj swoje umiejętności...
      </p>
      <div className="flex flex-col items-center space-y-2">
        <img
          src="logo3.png"
          alt="logo"
          className="w-32 h-32 rounded-full"
        />
        <span className="text-base opacity-90">
          Dołącz do tysięcy zadowolonych użytkowników!
        </span>
      </div>
    </div>
  </div>
</div>

    </section>
  );
}
