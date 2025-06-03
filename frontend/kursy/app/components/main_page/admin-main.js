"use client";
import Link from "next/link";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRoute,
} from "react-icons/fa";

export default function AdminMain() {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center pt-32 pb-16"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-white text-center space-y-8">
        <h1 className="text-5xl font-bold">Cześć, Admin!</h1>
        <p className="text-lg max-w-3xl mx-auto">
          To jest Twój panel zarządzania. Wybierz sekcję, którą chcesz edytować.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mt-10">
          <Link href="/admin/users" className="group">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition flex flex-col items-center space-y-4 shadow-lg border border-white/30">
              <FaUsers className="text-4xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Użytkownicy</span>
            </div>
          </Link>

          <Link href="/admin/courses" className="group">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition flex flex-col items-center space-y-4 shadow-lg border border-white/30">
              <FaChalkboardTeacher className="text-4xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Kursy</span>
            </div>
          </Link>

          <Link href="/admin/lessons" className="group">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition flex flex-col items-center space-y-4 shadow-lg border border-white/30">
              <FaBookOpen className="text-4xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Lekcje</span>
            </div>
          </Link>

          <Link href="/admin/roadmaps" className="group">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 hover:bg-white/30 transition flex flex-col items-center space-y-4 shadow-lg border border-white/30">
              <FaRoute className="text-4xl group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Roadmapy</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
