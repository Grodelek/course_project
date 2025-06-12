"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Brama from "@/app/components/auth/Brama";

export default function EdytujProfil() {
  const router = useRouter();

  const [emailZapisany, setEmailZapisany] = useState("");
  const [nazwaZapisana, setNazwaZapisana] = useState("");

  const [nowaNazwa, setNowaNazwa] = useState("");
  const [nowyEmail, setNowyEmail] = useState("");
  const [aktualneHaslo, setAktualneHaslo] = useState("");
  const [noweHaslo, setNoweHaslo] = useState("");
  const [powtorzHaslo, setPowtorzHaslo] = useState("");

  const [plik, setPlik] = useState(null);
  const [podglad, setPodglad] = useState("");

  const [blad, setBlad] = useState("");

  const [edycjaNazwy, setEdycjaNazwy] = useState(false);
  const [edycjaEmail, setEdycjaEmail] = useState(false);
  const [edycjaHasla, setEdycjaHasla] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("userName");

    if (!token || !email) {
      router.replace("/");
      return;
    }

    setEmailZapisany(email);
    setNazwaZapisana(username || "");
    setNowyEmail(email);
    setNowaNazwa(username || "");
  }, [router]);



  //  jak po wyjściu będą jakie błędy lub nawet wejsciu ponownym to będzie trzeba tu dodać zerowanie pól
  const anulujZmiany = () => {
  router.push("/profile");
};

/*
przelaczx
to powinno działać tak że jak wcisnę anuluj powraca do poprzedniej wersji więc tak inputy muszą być ciągle wyświetlone aby doszło do zmianny (o ile była zmianna)
*/
  const przelaczNazwe = () => {
    setEdycjaNazwy((poprzedni) => {
      if (poprzedni) setNowaNazwa(nazwaZapisana); 
      return !poprzedni;
    });
  };

  const przelaczEmail = () => {
    setEdycjaEmail((poprzedni) => {
      if (poprzedni) setNowyEmail(emailZapisany);
      return !poprzedni;
    });
  };

  const przelaczHaslo = () => {
    setEdycjaHasla((poprzedni) => {
      if (poprzedni) {
        setAktualneHaslo("");
        setNoweHaslo("");
        setPowtorzHaslo("");
      }
      return !poprzedni;
    });
  };

  const obsluzPlik = (e) => {
    const file = e.target.files[0];
    setPlik(file || null);
    setPodglad(file ? URL.createObjectURL(file) : "");
  };

  const wyslijFormularz = async (e) => {
    e.preventDefault();
    setBlad("");

    // to powinno sprawdzać czy zostały dokonen jakieś zmianny (dużo napraw dalej moze nie działac)
    const zmienionoNazwe =
      edycjaNazwy && nowaNazwa.trim() !== "" && nowaNazwa !== nazwaZapisana;
    const zmienionoEmail =
      edycjaEmail && nowyEmail.trim() !== "" && nowyEmail !== emailZapisany;
    const zmienionoHaslo =
      edycjaHasla &&
      (aktualneHaslo.trim() !== "" ||
      noweHaslo.trim()    !== "" ||
      powtorzHaslo.trim() !== "");
    const zmienionoZdjecie = !!plik;

    if (
      !zmienionoNazwe &&
      !zmienionoEmail &&
      !zmienionoHaslo &&
      !zmienionoZdjecie
    ) {
      setBlad("Nie wprowadzono żadnych zmian.");
      return;
    }

    
    if (zmienionoNazwe) {
      try {
            const currentPassword = aktualneHaslo;
            const newUsername = nowaNazwa;
            
            const response = await fetch(`http://localhost:8080/change-username?email=${encodeURIComponent(emailZapisany)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newUsername }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(errorText);
              setBlad(errorText);
              return;
            }

            localStorage.setItem("userName", nowaNazwa);
          }
        catch (err) {
          return;
        }
    }

    

    if (zmienionoZdjecie) {
      const form = new FormData();
      form.append("file", plik);
      form.append("email", emailZapisany);

      try {
        const res = await fetch("http://localhost:8080/api/s3/upload", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `Status ${res.status}`);
        }

        const text = await res.text();
        if (!text) throw new Error("Brak odpowiedzi z serwera");
        const data = JSON.parse(text);

        localStorage.setItem("photoPath", data.filePath);
        // to tylko zmienia w localstorage
      } catch (err) {
        console.error("Błąd uploadu:", err);
        setBlad(`Nie udało się zapisać zmian: ${err.message}`);
      }

    }
    if (zmienionoEmail){
      try {
            const currentPassword = aktualneHaslo;

            const response = await fetch(`http://localhost:8080/change-email?email=${encodeURIComponent(emailZapisany)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, newEmail: nowyEmail }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(errorText);
              setBlad(errorText);
              return;
            }

            localStorage.setItem("email", nowyEmail);
          }
        catch (err) {
          return;
        }
    }


    if (edycjaHasla) {
      if (!aktualneHaslo.trim() || !noweHaslo.trim() || !powtorzHaslo.trim()) {
        setBlad("Wszystkie pola hasła są wymagane.");
        return;
      }
      if (noweHaslo !== powtorzHaslo) {
        setBlad("Nowe hasło i potwierdzenie muszą być takie same.");
        return;
      }
       try {
            let email = emailZapisany;
            if(zmienionoEmail){
              email = nowyEmail;
            }
            const currentPassword = aktualneHaslo;
            const password = noweHaslo;
            const confirmPassword = powtorzHaslo;
            const response = await fetch(`http://localhost:8080/reset-password?email=${encodeURIComponent(email)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentPassword, password, confirmPassword }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(errorText);
              setBlad(errorText);
              return;
            }

            
          }
        catch (err) {
          return;
        }
    }

    router.push("/profile");
  };

  return (
    <Brama>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80" />
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8">Edytuj Profil</h1>

          <form
            onSubmit={wyslijFormularz}
            className="max-w-md mx-auto bg-white/20 backdrop-blur-sm rounded-lg shadow-xl border border-white/30 p-6 text-white space-y-6"
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Nazwa użytkownika:
                  <span className="block ml-2 text-gray-200 font-bold">
                    {nazwaZapisana}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={przelaczNazwe}
                  className="text-blue-300 hover:underline text-xs"
                >
                  {edycjaNazwy ? "Anuluj" : "Zmień"}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  edycjaNazwy ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <input
                  type="text"
                  value={nowaNazwa}
                  onChange={(e) => setNowaNazwa(e.target.value)}
                  className="block w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white focus:ring focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Adres e-mail:
                  <span className="block ml-2 text-gray-200 font-bold">
                    {emailZapisany}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={przelaczEmail}
                  className="text-blue-300 hover:underline text-xs"
                >
                  {edycjaEmail ? "Anuluj" : "Zmień"}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  edycjaEmail ? "max-h-40 mt-2" : "max-h-0"
                }`}
              >
                <input
                  type="email"
                  value={nowyEmail}
                  onChange={(e) => setNowyEmail(e.target.value)}
                  className="block w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white focus:ring focus:ring-blue-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Hasło:</span>
                <button
                  type="button"
                  onClick={przelaczHaslo}
                  className="text-blue-300 hover:underline text-xs"
                >
                  {edycjaHasla ? "Anuluj" : "Zmień"}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  edycjaHasla ? "max-h-80 mt-2" : "max-h-0"
                }`}
              >
                
                <input
                  type="password"
                  placeholder="Nowe hasło"
                  value={noweHaslo}
                  onChange={(e) => setNoweHaslo(e.target.value)}
                  className="block w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white focus:ring focus:ring-blue-400 mb-2"
                />
                <input
                  type="password"
                  placeholder="Powtórz nowe hasło"
                  value={powtorzHaslo}
                  onChange={(e) => setPowtorzHaslo(e.target.value)}
                  className="block w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white focus:ring focus:ring-blue-400"
                />
                <div className="text-right text-xs mt-1">
                  <button
                    type="button"
                    onClick={() => router.push("/reset-password")}
                    className="text-blue-300 hover:underline"
                  >
                    Nie pamiętam hasła?
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium">Zdjęcie profilowe:</span>
              <div className="relative mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={obsluzPlik}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-between bg-white/10 border border-white/30 rounded px-4 py-2">
                  <span className="text-white italic">
                    {plik ? plik.name : "Kliknij, aby wybrać plik..."}
                  </span>
                </div>
              </div>
              {podglad && (
                <img
                  src={podglad}
                  alt="Podgląd zdjęcia"
                  className="w-32 h-32 rounded-full object-cover mx-auto mt-4"
                />
              )}
            </div>
            <div>
              <input
                  type="password"
                  placeholder="Aktualne hasło"
                  value={aktualneHaslo}
                  onChange={(e) => setAktualneHaslo(e.target.value)}
                  className="block w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white focus:ring focus:ring-blue-400 mb-2"
                />
            </div>
            {blad && <p className="text-red-400 text-sm">{blad}</p>}

            <button
              type="button"
              onClick={wyslijFormularz}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
            >
              Zapisz zmiany
            </button>
            <button
              type="button"
              onClick={anulujZmiany}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
            >
              Anuluj
          </button>

          </form>
        </div>
      </section>
    </Brama>
  );
}
