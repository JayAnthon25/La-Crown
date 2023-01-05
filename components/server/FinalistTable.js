import React, { useState, useEffect } from "react";
import { getList, getRawFinalistData, getFinalistScores } from "./APIcalls";
import { PrinterOutline, RefreshOutline } from "../shared/Icons";

export default function FinalistTable({ ret }) {
  const [juds, setJuds] = useState([]);
  const [cons, setCons] = useState([]);
  const [scores, setScores] = useState([]);
  const [showRawScores, setShowRawScores] = useState(false);
  let ontheflyArray = [];
  const [finalRanks, setFinalRanks] = useState([]);
  // const [finalList, setFinalList] = useState(0);
  useEffect(() => {
    getList("jud", setJuds);
    getRawFinalistData(setCons);
    getFinalistScores(setScores);
  }, []);

  const refreshTable = () => {
    getRawFinalistData(setCons);
    getFinalistScores(setScores);
  };
  const distRanks = (q, w, e) => {
    // mini drills
    let criFiltered = scores.filter((el) => el.attributes.cri === w);
    let judFiltered = criFiltered.filter((el) => el.attributes.jud === e);
    // ranking mechanism
    let arr = judFiltered.map((raw) => raw.attributes.raw_score);
    let sorted = arr.slice().sort((a, b) => b - a);
    let ranks = arr.map((v) => sorted.indexOf(v) + 1);
    // get target index
    let targeted = judFiltered.filter((el) => el.attributes.con === q);
    let targetIndex = judFiltered.indexOf(targeted[0]);

    return ranks.length !== 0 ? ranks[targetIndex] : "-";
  };
  const passbyCopy = (num) => {
    ontheflyArray.push(num);
    return num;
  };
  const showFinalRanks = () => {
    let arr = ontheflyArray;
    let sorted = arr.slice().sort((a, b) => a - b);
    let ranks = arr.map((v) => sorted.indexOf(v) + 1);
    setFinalRanks(ranks);

    // getting as much function from this
    // prep-ing finalist table
    // let newFinalList = [];
    // ranks.forEach((q, index) => {
    //   if (q <= finalList) newFinalList.push(allList.cons.data[index].id);
    // });
    // updateRawFinalistData(newFinalList);
  };
  const prepPrintFinalTable = (e) => {
    localStorage.setItem("tobePrinted", JSON.stringify({ cri: e }));
  };
  const checkRankValidity = (q, w) => {
    // let criFiltered = scores.filter((el) => el.attributes.cri === q.id);
    let judFiltered = scores.filter((el) => el.attributes.jud === w.attributes.jud_number.toString());
    return (
      <td key={w.id} className={`table-control ${judFiltered.length !== cons.length ? "bg-red-200" : "bg-green-200"}`}>
        {judFiltered.length !== cons.length ? "✗" : "✓"}
      </td>
    );
  };

  if (ret) return null;
  return (
    // className="border rounded-md p-2 mt-2 border-gray-200 bg-white"
    <div className="mt-4">
      <div className="flex">
        <div className="flex-auto text-xl font-extrabold ml-1 mb-2">Finalist Table</div>
        <div className="form-check mr-1 mt-1">
          <input
            className="cursor-pointer"
            type="checkbox"
            id="showRawFinal"
            onChange={() => setShowRawScores(!showRawScores)}
          />
          <label className="inline-block cursor-pointer ml-1" htmlFor="showRawFinal">
            <small>Show Raw Scores</small>
          </label>
        </div>
        <a
          href="/reports"
          target="_blank"
          className="flex-none bg-orange-400 hover:bg-orange-500 p-1 m-1 mb-2 rounded-lg"
          onClick={() => prepPrintFinalTable("-1")}>
          <PrinterOutline />
        </a>
        <button className="m-1 mb-2 p-1 flex-none bg-green-400 hover:bg-green-600 rounded-full" onClick={refreshTable}>
          <RefreshOutline />
        </button>
      </div>

      <table className="group w-full border-2">
        <THeadBuilder juds={juds} />

        <tbody>
          {cons.map((q, conIndex) => {
            let conFiltered = scores.filter((el) => el.attributes.con === q.attributes.con_number.toString()); // mini drill
            let lowerIsBetter = 0;

            return (
              <tr key={q.id} className="table-control">
                <th className="table-control-th-coro">{q.attributes.con_number}</th>
                <th className="table-control-th-coro">{q.attributes.name}</th>

                {juds.map((w) => {
                  let judFiltered = conFiltered.filter(
                    (el) => el.attributes.jud === w.attributes.jud_number.toString()
                  ); // mini drill
                  let temp = distRanks(q.attributes.con_number.toString(), "-1", w.attributes.jud_number.toString());
                  lowerIsBetter += Number.isInteger(temp) ? temp : 0;

                  return showRawScores ? (
                    <td key={w.id} className="table-control">
                      {judFiltered.length !== 0 ? judFiltered[0].attributes.raw_score : "-"}
                    </td>
                  ) : (
                    <td key={w.id} className="table-control">
                      {distRanks(q.attributes.con_number.toString(), "-1", w.attributes.jud_number.toString())}
                    </td>
                  );
                })}

                <td className="table-control">{passbyCopy(lowerIsBetter)}</td>
                {/* SCORES render horizontally; but we need to capture data vertically */}
                {/* to accomodate for the timings we use USER intervention -> onclick */}
                <td className="table-control cursor-pointer" onClick={showFinalRanks}>
                  {finalRanks.length !== 0 ? finalRanks[conIndex] : "Click Me"}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="table-control bg-gray-300" colSpan={2}></td>
            {juds.map((w) => {
              return !w ? null : checkRankValidity("-1", w);
            })}
            <td className="table-control bg-gray-300" colSpan={2}>
              checks
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function THeadBuilder({ juds }) {
  return (
    <thead>
      <tr className="table-control bg-black">
        <th className="table-control-th-coro" rowSpan={2}>
          Num
        </th>
        <th className="table-control-th-coro" rowSpan={2}>
          Contestants
        </th>
        <th className="table-control-th-coro" colSpan={juds.length}>
          Coronation
        </th>
        <th className="table-control-th-coro" rowSpan={2}>
          Total
        </th>
        <th className="table-control-th-coro" rowSpan={2}>
          Champions
        </th>
      </tr>
      <tr className="table-control">
        {juds.map((i) => {
          return (
            <th key={i.id} className="table-control-th-coro">
              {i.attributes.jud_number}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}