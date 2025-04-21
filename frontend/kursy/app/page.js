"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import LoggedIn from "./components/main_page/logged-in"
import NotLoggedIn from "./components/main_page/not-logged-in"
import Banned from "./components/main_page/baned";

export default function Home() {
  const [token, setToken] = useState("");
  const [Ban, setBan] = useState("");

  useEffect(() => {
      if (typeof window !== "undefined") {
        setToken(localStorage.getItem("token") || "");
        setBan(localStorage.getItem("banEnd") || "");
      }
    }, []);

  if(token != ""){
    return (
        <LoggedIn />
      );
  }
  else if(Ban != ""){
    return(
      <Banned />
    );
  }
  else{
    return (
        <NotLoggedIn />
      );
  }

}
