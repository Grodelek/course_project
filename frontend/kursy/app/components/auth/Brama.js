"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "../navigation/navigation";
import AdminNavigation from "../navigation/admin-navigation";
import Banned from "../main_page/baned";
import NotLoggedIn from "../main_page/not-logged-in";
import LoggedIn from "../main_page/logged-in";
import AdminMain from "../main_page/admin-main";
import { useUser } from "./UserContext";

export default function Brama({ children }) {
  const [status, setStatus] = useState("loading");
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useUser();

  const publicPaths = ["/polityka-prywatnosci", "/regulamin"];

  // Funkcja do aktualizacji statusu na podstawie localStorage
  const updateStatus = () => {
    const token = localStorage.getItem("token");
    const banEnd = localStorage.getItem("banEnd");
    const isAdmin = localStorage.getItem("isAdmin") === "1";

    if (banEnd) setStatus("banned");
    else if (!token) setStatus("notLoggedIn");
    else if (isAdmin) setStatus("admin");
    else setStatus("user");
  };

  // Aktualizacja localStorage na podstawie userData
  const updateLocalStorage = () => {
    if (userData) {
      let reload = false;
      const isAdmin = userData.roles == "ADMIN" ? "1" : "0";
      if(localStorage.getItem("email") != userData.email || localStorage.getItem("userName") != userData.username || localStorage.getItem("isAdmin") != isAdmin){
        reload = true;
      }
      localStorage.setItem("email", userData.email || "");
      localStorage.setItem("userName", userData.username || "");
      localStorage.setItem("isAdmin", isAdmin);

      if(reload){
        window.location.reload();
      }
    }
  };

  // Wywołaj updateStatus i updateLocalStorage przy montowaniu i zmianie pathname
  useLayoutEffect(() => {
    updateLocalStorage(); // Aktualizuj localStorage przy montowaniu
    updateStatus(); // Aktualizuj status
  }, [pathname]); // Zależność od pathname, aby reagować na zmiany trasy

  useEffect(() => {
    updateLocalStorage();
  })
  // Przekierowanie dla nieautoryzowanych tras
  useEffect(() => {
    if (
      (status === "notLoggedIn" || status === "banned") &&
      !publicPaths.includes(pathname) &&
      pathname !== "/"
    ) {
      router.replace("/");
    }
  }, [status, pathname, router]);

  if (status === "banned" && pathname === "/") return <Banned />;
  if (status === "notLoggedIn" && pathname === "/") return <NotLoggedIn />;
  if (
    (status === "notLoggedIn" || status === "banned") &&
    publicPaths.includes(pathname)
  )
    return <>{children}</>;

  if (status === "admin") {
    return (
      <>
        <AdminNavigation />
        {pathname === "/" && <AdminMain />}
        {children}
      </>
    );
  }

  if (status === "user") {
    return (
      <>
        <Navigation />
        {pathname === "/" && <LoggedIn />}
        {children}
      </>
    );
  }

  return null;
}