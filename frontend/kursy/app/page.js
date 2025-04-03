"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoggedIn from "./components/main_page/logged-in"
import NotLoggedIn from "./components/main_page/not-logged-in"

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
      if (typeof window !== "undefined") {
        setToken(localStorage.getItem("token") || "");
      }
    }, []);

  if(token != ""){
    return (
        <LoggedIn />
      );
  }
  else{
    return (
        <NotLoggedIn />
      );
  }

}
