import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ListMaker from "./ListMaker";
import ResultsTable from "./ResultsTable";
import MiscMaker from "./MiscMaker";
import { cons, juds, cris } from "../shared/endpoints";

export default function Container() {
  const router = useRouter();
  useEffect(() => {
    if (!sessionStorage.getItem("serv")) {
      router.push("/");
    }
  }, [router]);

  return (
    <div>
      <div className="grid items-start grid-cols-4 gap-2">
        <ListMaker title="Contestants" />
        <ListMaker title="Judges" />
        <ListMaker title="Criteria" />
        <MiscMaker title="Other Option" />
      </div>

      <ResultsTable />
    </div>
  );
}