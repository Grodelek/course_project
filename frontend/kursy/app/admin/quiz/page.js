"use client";

import { useState } from "react";
import Brama from "@/app/components/auth/Brama";
import {
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEdit,
  FaCheck,
} from "react-icons/fa";

function pustaOdpowiedź() {
  return { tresc: "", poprawna: false };
}

function pustePytanie() {
  return { tresc: "", odpowiedzi: [pustaOdpowiedź(), pustaOdpowiedź()] };
}

export default function KreatorQuizu() {
  const [pytania, setPytania]     = useState([]);
  const [podgląd, setPodgląd]     = useState(false);
  const [błąd, setBłąd]           = useState("");

  const dodajPytanie = () => setPytania([...pytania, pustePytanie()]);

  const usuńPytanie = (idx) =>
    setPytania(pytania.filter((_, i) => i !== idx));

  const przesuńPytanie = (idx, dir) => {
    const kopia = [...pytania];
    const swap  = idx + dir;
    if (swap < 0 || swap >= kopia.length) return;
    [kopia[idx], kopia[swap]] = [kopia[swap], kopia[idx]];
    setPytania(kopia);
  };

  const aktualizujPytanie = (idx, dane) =>
    setPytania((prev) => prev.map((p, i) => (i === idx ? dane : p)));

  const otwórzPodgląd = () => {
    const niepoprawne = pytania.find(
      (p) =>
        !p.tresc.trim() ||
        p.odpowiedzi.some((o) => !o.tresc.trim()) ||
        !p.odpowiedzi.some((o) => o.poprawna)
    );
    if (niepoprawne) {
      setBłąd("Każde pytanie i odpowiedź musi być uzupełnione; zaznacz co najmniej jedną odpowiedź jako poprawną.");
      return;
    }
    setBłąd("");
    setPodgląd(true);
  };

  const renderujOdpowiedźEdytor = (pidx, oidx, odp) => (
    <div key={oidx} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={odp.poprawna}
        onChange={(e) => {
          const k = [...pytania];
          k[pidx].odpowiedzi[oidx].poprawna = e.target.checked;
          setPytania(k);
        }}
      />
      <input
        type="text"
        value={odp.tresc}
        placeholder={`Odpowiedź ${oidx + 1}`}
        onChange={(e) => {
          const k = [...pytania];
          k[pidx].odpowiedzi[oidx].tresc = e.target.value;
          setPytania(k);
        }}
        className="flex-1 bg-white/10 border border-white/30 rounded px-2 py-1 text-white"
      />
      <button
        onClick={() => {
          const k = [...pytania];
          k[pidx].odpowiedzi.splice(oidx, 1);
          setPytania(k);
        }}
        className="text-red-400"
      >
        <FaTrash />
      </button>
    </div>
  );

  const renderujPytanieEdytor = (pyt, idx) => (
    <div key={idx} className="bg-white/10 p-4 rounded border border-white/20 space-y-3">
      <div className="flex justify-between">
        <span className="font-semibold">Pytanie {idx + 1}</span>
        <div className="flex gap-2 text-sm">
          <button onClick={() => przesuńPytanie(idx, -1)}><FaArrowUp /></button>
          <button onClick={() => przesuńPytanie(idx, 1)} ><FaArrowDown/></button>
          <button onClick={() => usuńPytanie(idx)} className="text-red-400"><FaTrash/></button>
        </div>
      </div>

      <textarea
        value={pyt.tresc}
        onChange={(e) => aktualizujPytanie(idx, { ...pyt, tresc: e.target.value })}
        placeholder="Treść pytania..."
        className="w-full bg-white/20 p-2 rounded text-black"
        rows={2}
      />

      <div className="space-y-2">
        {pyt.odpowiedzi.map((o, oidx) => renderujOdpowiedźEdytor(idx, oidx, o))}
      </div>

      <button
        onClick={() => {
          const k = [...pytania];
          k[idx].odpowiedzi.push(pustaOdpowiedź());
          setPytania(k);
        }}
        className="mt-2 flex items-center gap-2 bg-white/20 px-2 py-1 rounded text-sm"
      >
        <FaPlus /> Dodaj odpowiedź
      </button>
    </div>
  );

  const renderujPodgląd = (pyt, idx) => (
    <div key={idx} className="mb-8">
      <h2 className="font-semibold mb-2">
        {idx + 1}. {pyt.tresc}
      </h2>
      <ul className="space-y-1">
        {pyt.odpowiedzi.map((o, i) => (
          <li key={i} className="flex items-center gap-2">
            <FaCheck
              className={`${
                o.poprawna ? "text-green-400" : "opacity-0"
              }`}
            />
            {o.tresc}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Brama>
      <section
        className="relative w-full min-h-screen bg-cover bg-center pt-32 pb-16"
        style={{ backgroundImage: 'url("/tloStart.png")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80" />
        <div className="relative z-10 container mx-auto px-4 text-white max-w-4xl space-y-6">

          <h1 className="text-4xl font-bold">Kreator quizu</h1>
          <h1 className="text-1xl font-bold">Wybierz lekcje</h1>
          <select className="block w-full max-w-xs bg-white/20 backdrop-blur-sm text-black border border-white/30 rounded-lg px-4 py-2 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500" name="kursy" id="kursy">
          </select>
          {!podgląd && (
            <>
              <button
                onClick={dodajPytanie}
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded"
              >
                <FaPlus /> Dodaj pytanie
              </button>

              <div className="space-y-4">{pytania.map(renderujPytanieEdytor)}</div>

              {błąd && <p className="text-red-400">{błąd}</p>}

              <button
                onClick={otwórzPodgląd}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold mt-6 inline-flex items-center gap-2"
              >
                <FaEye /> Podgląd
              </button>
            </>
          )}

          {podgląd && (
            <>
              {pytania.map(renderujPodgląd)}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setPodgląd(false)}
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded font-semibold inline-flex items-center gap-2"
                >
                  <FaEdit /> Wróć do edycji
                </button>

                <button
                  disabled
                  className="bg-blue-500 opacity-60 px-6 py-3 rounded font-semibold inline-flex items-center gap-2 cursor-not-allowed"
                >
                  Wyślij do bazy (wkrótce)
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </Brama>
  );
}
