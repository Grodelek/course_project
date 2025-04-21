"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Authenticate() {
    const [email, setEmail] = useState("");
    useEffect(() => {
      const storedEmail = localStorage.getItem("email");
      setEmail(storedEmail);
    }, []);

    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
              
              
              const response = await fetch("http://localhost:8080/authenticate?email="+email, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ verificationCode }),
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
              router.push('/logowanie');
  
          } catch (err) {
              setError(err.message);
          }
    };

    return (
        <section className="flex w-full h-screen">
          <div className="w-full md:w-1/2 bg-gray-900 text-white flex flex-col justify-center p-8">
            <div className="max-w-md mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6">Potwierdź wysłanie maila</h1>

                <p className="mb-6 text-lg text-gray-200 leading-relaxed">
                    Wysłaliśmy kod weryfikacyjny na adres:
                    <br />
                    <span className="block mt-2 text-xl font-bold text-white">{email}</span>
                </p>

                <form className="space-y-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Wprowadź kod weryfikacyjny"
                        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                        onClick={handleSubmit}
                    >
                        Potwierdź
                    </button>
                </form>

                <p className="text-sm text-gray-400 mt-4">
                Nie otrzymałeś kodu? 
                <button className="text-blue-400 hover:underline ml-1">Wyślij ponownie</button>.
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