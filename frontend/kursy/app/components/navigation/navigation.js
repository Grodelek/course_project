"use client"
import { useEffect, useState } from "react";
import NavLink from "./navlink";
import { FaHome, FaChalkboard, FaSignOutAlt, FaCog, FaRoute, FaUserAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const [name, setName] = useState("Gość");
  const [photoPath, setPhotoPath] = useState("");

  const profileImgUrl = photoPath
    ? `https://courseapp-bucket.s3.eu-north-1.amazonaws.com/${photoPath}`
    : null;

  const handleSubmit = () =>{
    localStorage.clear();
    router.replace('/');
    window.location.reload();
  };

useEffect(() => {
  const stored = localStorage.getItem("userName");
  if (stored) {
    setName(stored);
    const storedPhoto = localStorage.getItem("photoPath");
    if (storedPhoto) {
      setPhotoPath(storedPhoto);
    }
    return;
  }

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  if (!token || !email) return;

  fetch(
    `http://localhost:8080/user/username?email=${encodeURIComponent(email)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          console.error("Błąd pobierania userName:", text || res.status);
        });
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      const { username, photoPath: backendPath } = data;
      setName(username);
      localStorage.setItem("userName", username);

      if (backendPath) {
        setPhotoPath(backendPath);
        localStorage.setItem("photoPath", backendPath);
      }
    })
    .catch((err) => console.error("Fetch error:", err));
}, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md text-white py-3 px-8 flex justify-between items-center border-b border-white/20 z-50 shadow-md">
      <div className="text-lg font-semibold flex items-center space-x-2">
        {profileImgUrl ? (
          <img
            src={profileImgUrl}
            alt="Profil"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <FaUserAlt className="w-10 h-10 text-white" />
        )}
        <span>{name}</span>
      </div>

      <div className="flex space-x-6 text-sm font-medium">
        <NavLink href="/" className="hover:text-blue-300 transition flex items-center space-x-2">
          <FaHome className="inline-block mr-1 text-4xl" /> Strona Główna
        </NavLink>
        <NavLink href="/courses" className="hover:text-blue-300 transition flex items-center space-x-2">
          <FaChalkboard className="inline-block mr-1 text-2xl" /> Kursy
        </NavLink>
        <NavLink href="/roadmaps" className="hover:text-blue-300 transition flex items-center space-x-2">
          <FaRoute className="inline-block mr-1 text-4xl" /> Road mapy
        </NavLink>
        <NavLink href="/profile" className="hover:text-blue-300 transition flex items-center space-x-2">
          <FaCog className="inline-block mr-1 text-2xl" /> Konto
        </NavLink>
      </div>

      <button className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 
                         rounded-lg transition font-semibold shadow-lg"
                         onClick={handleSubmit}>
        <FaSignOutAlt />
        <span>Wyloguj się</span>
      </button>
    </nav>
  );
}
