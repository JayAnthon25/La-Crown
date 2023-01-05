import React, { useState, useEffect } from "react";
import { getContestName, getCri } from "./APIcalls";

export default function Header() {
  const [contestName, setContestName] = useState("");
  const [criDetail, setCriDetail] = useState({ attributes: { name: "Coronation" } });
  useEffect(() => {
    getContestName(setContestName);
    if (JSON.parse(localStorage.getItem("tobePrinted")).cri !== "all") {
      getCri(JSON.parse(localStorage.getItem("tobePrinted")).cri, setCriDetail);
    } else {
      setCriDetail({ attributes: { name: "All Criteria" } });
    }
  }, []);

  return (
    <div>
      <div className="text-center text-3xl font-extrabold">{contestName}</div>
      <div className="text-center text-xl mt-2 font-bold text-red-500">Final Ranked Scoresheet for:</div>
      <div className="text-center text-2xl font-bold">{criDetail.attributes.name}</div>
    </div>
  );
}
