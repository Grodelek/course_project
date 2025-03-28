import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">

      <main className="text-center p-6 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Witaj na platformie kursowej!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Odkrywaj interaktywne kursy i roadmapy, które pomogą Ci zdobyć nowe umiejętności i rozwijać swoją karierę.
        </p>
        <div className="flex space-x-12 mt-4">
          <a
            href="/rejestracja"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg shadow-md hover:bg-blue-700 transition"
          >
            Zarejestruj się
          </a>
          <a
            href="/logowanie"
            className="px-8 py-3 bg-gray-600 text-white rounded-lg text-lg shadow-md hover:bg-gray-700 transition ml-60"
          >
            Zaloguj się
          </a>
        </div>
      </main>
    </div>
  );
}
