"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-50">
      <img
        src="/loading.gif"
        alt="Ładowanie..."
        className="w-500 h-300 mb-6 animate-pulse"
      />
      <p className="text-white text-xl font-semibold">
        Robimy co możemy… 🚀
      </p>
    </div>
  );
}
