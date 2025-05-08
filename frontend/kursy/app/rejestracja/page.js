"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Error from "../components/ui/Error.js";

export default function Rejestracja() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorTop, setErrorTop]   = useState("");
  const [modalData, setModalData] = useState({ msg: "", gif: "" });
  const router = useRouter();
  //wysłanie formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInvalidFields([]);
    setErrorTop("");

    const missing = [];
    if (!username.trim()) missing.push("username");
    if (!email.trim())    missing.push("email");
    if (!password.trim()) missing.push("password");
    if (missing.length) {
      setInvalidFields(missing);
      setErrorTop("Uzupełnij wszystkie wymagane pola.");
      setModalData({
        msg: "Za mało nam o sobie napisałeś! Musisz podać nazwę, e‑mail i hasło, aby utworzyć konto.",
        gif: "/oops2.gif",
      });
      setShowError(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();

        if (res.status === 401)  { //tu powinno być 409
          setInvalidFields(["email"]);
          setErrorTop("Ten adres e‑mail jest już zarejestrowany.");
          setModalData({
            msg: "Chyba mamy już kogoś takiego! Spróbuj ponownie lub zaloguj się.",
            gif: "/oops1.gif",
          });
        } else {
          setErrorTop(`Błąd ${res.status}: ${msg}`);
        }

        setShowError(true);
        return;
      }
      localStorage.setItem("email", email);
      router.push("/authenticate");
    } catch (err) {
      setErrorMsg(err.message);
      setShowError(true);
    }
  };

  return (
    <>
    {showError && (
      <Error
      msg={modalData.msg}
      gif={modalData.gif}
      onClose={() => setShowError(false)}
      />
    )}
    <section className="flex w-full h-screen">
      <div className="w-full md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6">Zarejestruj się</h1>
          {errorTop && (
  <div className="mb-4 bg-red-600/90 text-white p-3 rounded">
    {errorTop}
  </div>
)}

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
  <button type="button" className="w-full flex items-center justify-center gap-x-2
                     bg-gray-700 hover:bg-gray-600 py-2 rounded
                     font-semibold transition">
    <img
      src="/google.png"
      alt="Google"
      className="w-6 h-6"
    />
    <span>Zarejestruj się z Google</span>
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
              className={`w-full p-2 text-black-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500
              ${
      invalidFields.includes("username")
        ? "border-red-500 focus:border-red-500"
        : "border-gray-700 focus:border-blue-500"
    }`}
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
              className={`w-full p-2 text-white border rounded focus:outline-none
                ${
                  invalidFields.includes("email")
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-700 focus:border-blue-500"
                }`}
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
              className={`w-full p-2 text-white-900 border border-gray-700 rounded focus:outline-none focus:border-blue-500
              ${
      invalidFields.includes("username")
        ? "border-red-500 focus:border-red-500"
        : "border-gray-700 focus:border-blue-500"
    }`}
            />
          </div>

          <div className="mb-4 text-sm text-gray-400">
          <p className="text-sm text-center text-gray-300">
  Rejestrując się akceptujesz&nbsp;
  <Link href="/regulamin">
    <span className="underline hover:text-white">Regulamin</span>
  </Link>
  &nbsp;i&nbsp;
  <Link href="/polityka-prywatnosci">
    <span className="underline hover:text-white">Politykę prywatności</span>
  </Link>.
</p>

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
    </>
  );
}
