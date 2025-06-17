"use client";

import { useEffect } from "react";
import { useUser } from "./UserContext";

export default function ClientLayout({ children }) {
  const { setUserData } = useUser();

  useEffect(() => {
    const fetchUserData = async (token) => {
      try {
        const response = await fetch(
          `http://localhost:8080/userByToken?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Błąd ${response.status}`);
        }

        const data = await response.json();
        setUserData(data); // Update userData in context
      } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
        localStorage.removeItem("token"); // Remove invalid token
        setUserData(null);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token); // Fetch data if token exists
    } else {
      setUserData(null); // Reset userData if no token
    }
  }, [setUserData]);

  return <>{children}</>;
}