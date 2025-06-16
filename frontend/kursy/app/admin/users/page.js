"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Brama from "../../components/auth/Brama";
import { FaBan, FaUndo, FaTrash } from "react-icons/fa";

export default function Users() {
  //const [coursesData, setCoursesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [error, setError] = useState("");
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [banEndDate, setBanEndDate] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [banReason, setBanReason] = useState("");
  useEffect(() => {
    async function fetchData(){
      setError("");
      try {

          const response = await fetch("http://localhost:8080/allUsers", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error(`Błąd `);
          }
          const data = await response.json();
          setUsersData(data);

      } catch (err) {
          setError(err.message);
      }
    }
    fetchData();
          }, []);

  // paginacja
  const itemsPerPage = 10;
  const totalPages = Math.ceil(usersData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = usersData.slice(indexOfFirstItem, indexOfLastItem);

  const previousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  // Dla Andrzeja
  const zbanujKonto = async (userEmail, endDate, reason) => {
    try {
      const response = await fetch(`http://localhost:8080/ban?email=${encodeURIComponent(userEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateEnd: endDate, reason}),
      });

      if (!response.ok) throw new Error("Błąd przy banowaniu.");

      const refreshed = await fetch("http://localhost:8080/allUsers");
      const data = await refreshed.json();
      setUsersData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const odbanujKonto = async (userEmail) => {
  try {
    const response = await fetch(`http://localhost:8080/unban?email=${encodeURIComponent(userEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Błąd przy odbanowywaniu.");

    const refreshed = await fetch("http://localhost:8080/allUsers");
    const data = await refreshed.json();
    setUsersData(data);
  } catch (err) {
    setError(err.message);
  }
};

  const usunKonto = async (id) => {
    try{
      const response = await fetch(`http://localhost:8080/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Błąd przy usuwaniu.");

      const refreshed = await fetch("http://localhost:8080/allUsers");
      const data = await refreshed.json();
      setUsersData(data);
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <Brama>
<section
      className="relative w-full min-h-screen bg-cover bg-center pt-28 pb-10"
      style={{ backgroundImage: 'url("/tloStart.png")' }}
    >
      

      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-gray-800/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Użytkownicy</h1>

        <div className="bg-white/20 backdrop-blur-sm shadow-xl rounded-lg p-6 border border-white/30">
          <table className="min-w-full text-white">
            <thead>
              <tr className="border-b border-white/30">
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Id
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Nazwa użytkownika
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user) => (
                <tr key={user.id} className="border-b border-white/20">
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {user.roles == "BANNED" ? (
                      <button
                        onClick={() => odbanujKonto(user.email)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
                      >
                        <FaUndo /> Odbanuj
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setSelectedUserEmail(user.email);
                          setBanModalOpen(true);
                        }}
                        className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded transition"
                      >
                        <FaBan /> Zbanuj
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Czy na pewno chcesz usunąć konto użytkownika ${user.email}?`)) {
                          usunKonto(user.id);
                        }
                      }}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      <FaTrash /> Usuń
                    </button>
                  </div>
                  </td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    Brak kursów do wyświetlenia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {banModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Zbanuj użytkownika</h2>

                <p className="mb-2 text-sm text-gray-700">
                  <strong>Adres e-mail:</strong> {selectedUserEmail}
                </p>

                <label className="block mb-1 text-sm">Data końca bana:</label>
                <input
                  type="date"
                  value={banEndDate}
                  onChange={(e) => setBanEndDate(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />

                <label className="block mb-1 text-sm">Powód bana:</label>
                <textarea
                  rows={3}
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Wprowadź powód"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setBanModalOpen(false);
                      setBanEndDate("");
                      setBanReason("");
                      setSelectedUserEmail("");
                    }}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => {
                      zbanujKonto(selectedUserEmail, banEndDate, banReason);
                      setBanModalOpen(false);
                      setBanEndDate("");
                      setBanReason("");
                      setSelectedUserEmail("");
                    }}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Zbanuj
                  </button>
                </div>
              </div>
            </div>
          )}


          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/20 border border-white/20 rounded text-white hover:bg-white/30 disabled:opacity-50 transition"
            >
              Poprzednia
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded border border-white/20 transition ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/20 border border-white/20 rounded text-white hover:bg-white/30 disabled:opacity-50 transition"
            >
              Następna
            </button>
          </div>
        </div>
      </div>
    </section>
    </Brama>
    
  );
}