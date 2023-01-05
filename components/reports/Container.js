import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "./Header";
import AllCrisBody from "./AllCrisBody";
import Body from "./Body";

export default function Container() {
  const router = useRouter();
  const [printThis, setPrintThis] = useState("");
  useEffect(() => {
    if (!localStorage.getItem("tobePrinted")) {
      router.push("/");
    }
    setPrintThis(JSON.parse(localStorage.getItem("tobePrinted")).cri);
  }, [router]);

  if (printThis === "") return null;
  return (
    <div className="mx-2">
      <Header />

      {printThis !== "all" ? <Body /> : <AllCrisBody />}
    </div>
  );
}
