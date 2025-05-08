
import Link from "next/link";
import Brama from "../components/auth/Brama";
export const metadata = {
  title: "Regulamin – Kursy Internetowe",
  description: "Regulamin korzystania z platformy kursowej",
};

export default function TermsPage() {
  return (
    <Brama>
<section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">
          Regulamin
        </h1>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-8 border border-white/30 text-white space-y-6 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-2">§1. Definicje</h2>
            <p>
              <strong>Platforma</strong> – serwis dostępny pod adresem
              najlepszeKursyANS.com, umożliwiający Użytkownikom dostęp do kursów
              internetowych. <br />
              <strong>Użytkownik</strong> – osoba posiadająca konto na
              Platformie. <br />
              <strong>Usługodawca</strong> – właściciel Platformy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              §2. Warunki korzystania
            </h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Rejestracja w Platformie jest dobrowolna i bezpłatna. Użytkownik
                zobowiązuje się podać prawdziwe dane.
              </li>
              <li>
                Użytkownik ponosi pełną odpowiedzialność za działania
                wykonywane przy użyciu swojego konta.
              </li>
              <li>
                Zabronione jest dostarczanie treści bezprawnych lub naruszających
                dobra osobiste osób trzecich.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              §3. Prawa autorskie
            </h2>
            <p>
              Wszystkie materiały dydaktyczne dostępne w Platformie chronione są
              prawem autorskim. Kopiowanie, rozpowszechnianie lub udostępnianie
              bez zgody Usługodawcy jest zabronione.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              §4. Odstąpienie od umowy
            </h2>
            <p>
              Użytkownik ma prawo odstąpić od umowy w terminie 14 dni od daty
              zakupu kursu, o ile nie rozpoczął konsumpcji treści cyfrowych.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">§5. Postanowienia końcowe</h2>
            <p>
              W sprawach nieuregulowanych Regulaminem stosuje się przepisy
              Kodeksu cywilnego oraz innych obowiązujących aktów prawnych.
              Usługodawca zastrzega sobie prawo do zmian Regulaminu.
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
    </Brama>
    
  );
}
