"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRoute,
  FaPlusCircle,
  FaHome,
  FaSignOutAlt,
  FaQuestion,
} from "react-icons/fa";

export default function AdminNavigation() {
  const router = useRouter();

  const wyloguj = () => {
    localStorage.clear();
    router.replace("/");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md text-white py-3 px-8 flex justify-between items-center border-b border-white/20 z-50 shadow-md">
      <Link href="/" className="flex items-center space-x-2 text-lg font-semibold hover:text-blue-300">
        <FaHome className="text-2xl" />
        <span>Panel Admina</span>
      </Link>

      <div className="flex space-x-6 text-sm font-medium">
        <Link href="/admin/users" className="flex items-center space-x-2 hover:text-blue-300">
          <FaUsers className="text-xl" /> <span>Użytkownicy</span>
        </Link>
        <Link href="/admin/courses" className="flex items-center space-x-2 hover:text-blue-300">
          <FaChalkboardTeacher className="text-xl" /> <span>Kursy</span>
        </Link>
        <Link href="/admin/lessons" className="flex items-center space-x-2 hover:text-blue-300">
          <FaBookOpen className="text-xl" /> <span>Lekcje</span>
        </Link>
        <Link href="/admin/roadmaps" className="flex items-center space-x-2 hover:text-blue-300">
          <FaRoute className="text-xl" /> <span>Roadmapy</span>
        </Link>
        <Link href="/admin/lessons/builder" className="flex items-center space-x-2 hover:text-blue-300">
          <FaPlusCircle className="text-xl" /> <span>Nowa lekcja</span>
        </Link>
        <Link href="/admin/quiz" className="flex items-center space-x-2 hover:text-blue-300">
          <FaQuestion className="text-xl" /> <span>Nowe Quiz</span>
        </Link>
      </div>

      <button onClick={wyloguj} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-semibold shadow-lg">
        <FaSignOutAlt /> <span>Wyloguj się</span>
      </button>
    </nav>
  );
}
