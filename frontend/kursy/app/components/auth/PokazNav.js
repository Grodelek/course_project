"use client";
import { useEffect, useState } from "react";
import Navigation from '../navigation/navigation.js';

export default function PokazNav() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token") || "";
      setHasToken(token !== "");
    }
  }, []);


  if (!hasToken) return null;

  return <Navigation />;
}
