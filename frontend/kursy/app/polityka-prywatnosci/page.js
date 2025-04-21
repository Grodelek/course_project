import PokazNav from "../components/auth/PokazNav.js";
import Link from "next/link";
export const metadata = {
  title: "Polityka prywatności – Kursy Internetowe",
  description: "Jak przetwarzamy i chronimy Twoje dane osobowe",
};

export default function PrivacyPolicyPage() {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      <PokazNav />

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Polityka prywatności
        </h1>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-white/30 text-white space-y-6 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Administrator danych</h2>
            <p>
              Administratorem danych osobowych jest <strong>Gomez Sp. z o.o.</strong>,
              ul. Królewska 1, Stary Obóz 58-001 Kolonia Górnicza (dalej: „Administrator”).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Zakres i cel przetwarzania</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Dane podane podczas rejestracji (imię, nazwisko, e‑mail) są
                przetwarzane w celu utworzenia konta i realizacji usług
                szkoleniowych.
              </li>
              <li>
                Adres e‑mail może być wykorzystywany do wysyłania powiadomień
                systemowych i informacji o nowych kursach.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Podstawy prawne</h2>
            <p>
              Dane przetwarzamy na podstawie art.&nbsp;6 ust.&nbsp;1&nbsp;lit.
              <strong>b</strong> (niezbędność do realizacji umowy) oraz
              <strong> f</strong> (prawnie uzasadniony interes Administratora) RODO.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Odbiorcy danych</h2>
            <p>
              Twoje dane mogą być przekazywane dostawcom hostingu, usług
              płatności oraz narzędzi mailingowych – wyłącznie w zakresie
              niezbędnym do świadczenia usług.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Okres przechowywania</h2>
            <p>
              Dane przechowujemy przez czas trwania umowy, a po jej zakończeniu –
              przez okres wymagany przepisami prawa lub do momentu przedawnienia
              roszczeń.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Twoje prawa</h2>
            <p>
              Przysługuje Ci prawo dostępu do danych, ich sprostowania,
              usunięcia, ograniczenia przetwarzania, przeniesienia oraz wniesienia
              sprzeciwu. Możesz także złożyć skargę do Prezesa UODO.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Pliki cookies</h2>
            <p>
              Serwis używa technicznych cookies, które są niezbędne do
              prawidłowego działania strony oraz plików analitycznych w celu
              poprawiania jakości usług.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              8. Zmiany w Polityce prywatności
            </h2>
            <p>
              O wszelkich zmianach będziemy informować z wyprzedzeniem, publikując
              zaktualizowaną treść na tej stronie.
            </p>
          </section>
          <Link
            href="/"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded transition-colors duration-200 font-semibold mb-4 text-center block"
            >
                Wróć
            </Link>
        </div>
      </div>
    </section>
  );
}
