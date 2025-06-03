"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navigation from "../navigation/navigation";
import AdminNavigation from "../navigation/admin-navigation";
import Banned from "../main_page/baned";
import NotLoggedIn from "../main_page/not-logged-in";
import LoggedIn from "../main_page/logged-in";
import AdminMain from "../main_page/admin-main";


export default function Brama({ children }) {
  const [status, setStatus] = useState("loading");
  const pathname = usePathname();
  const router = useRouter();

  const publicPaths = ["/polityka-prywatnosci", "/regulamin"];

  useLayoutEffect(() => {
    const token   = localStorage.getItem("token");
    const banEnd  = localStorage.getItem("banEnd");
    const isAdmin = localStorage.getItem("isAdmin") === "1";

    if (banEnd)      setStatus("banned");
    else if (!token) setStatus("notLoggedIn");
    else if (isAdmin) setStatus("admin");
    else             setStatus("user");
  }, []);

  useEffect(() => {
    if ((status === "notLoggedIn" || status === "banned") && !publicPaths.includes(pathname) && pathname !== "/") {
      router.replace("/");
    }
  }, [status, pathname, router]);

  if (status === "banned" && pathname === "/") return <Banned />;
  if (status === "notLoggedIn" && pathname === "/") return <NotLoggedIn />;
  if ((status === "notLoggedIn" || status === "banned") && publicPaths.includes(pathname)) return <>{children}</>;

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
