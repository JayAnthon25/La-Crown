import { useState, useEffect } from "react";
import { getAllLists, getAllScores, updateRawFinalistData, getMisc } from "./APIcalls";
import FinalistTable from "./FinalistTable";
import { PrinterOutline, RefreshOutline } from "../shared/Icons";

export default function ResultsTable() {
  const [allList, setAllList] = useState({ cons: { data: [] }, juds: { data: [] }, cris: { data: [] } });
  const [scores, setScores] = useState([]);
  const [showRawScores, setShowRawScores] = useState(false);
  let ontheflyArray = [];
  const [finalRanks, setFinalRanks] = useState([]);
  const [finalList, setFinalList] = useState(0);
  const [disableCoronation, setDisableCoronation] = useState(false);
  useEffect(() => {
    getAllLists(setAllList);
    getAllScores(setScores);
    getMisc(null, null, setFinalList, null, setDisableCoronation);
  }, []);

  const refreshTable = () => {
    getAllLists(setAllList);
    getAllScores(setScores);
    getMisc(null, null, setFinalList, null, setDisableCoronation);
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
    let newFinalList = [];
    ranks.forEach((q, index) => {
      if (q <= finalList) newFinalList.push(allList.cons.data[index].id);
    });
    updateRawFinalistData(newFinalList);
  };
  const prepPrintFullTable = () => {
    localStorage.setItem("tobePrinted", JSON.stringify({ cri: "all" }));
  };
  const checkRankValidity = (q, w) => {
    let criFiltered = scores.filter((el) => el.attributes.cri === q.id);
    let judFiltered = criFiltered.filter((el) => el.attributes.jud === w.attributes.jud_number.toString());
    return (
      <td
        key={q.id + w.id}
        className={`table-control ${judFiltered.length !== allList.cons.data.length ? "bg-red-200" : "bg-green-200"}`}>
        {judFiltered.length !== allList.cons.data.length ? "✗" : "✓"}
      </td>
    );
  };

  if (scores.length === 0)
    return <div className="italic">---No Scores found; Tables will generate when scores are found---</div>;
  return (
    <div className="border rounded-md p-2 mt-2 border-gray-200 bg-white">
      <div className="flex">
        <div className="flex-none text-xl font-extrabold ml-1 mb-2">Results Table</div>
        <div className="flex-auto text-xs ml-1 mt-1 text-slate-400">{`Showing ${
          allList.cons.data.length * allList.juds.data.length * allList.cris.data.length
        } values`}</div>
        <div className="form-check mr-1 mt-1">
          <input
            className="cursor-pointer"
            type="checkbox"
            id="showRaw"
            onChange={() => setShowRawScores(!showRawScores)}
          />
          <label className="inline-block cursor-pointer ml-1" htmlFor="showRaw">
            <small>Show Raw Scores</small>
          </label>
        </div>
        <a
          href="/reports"
          target="_blank"
          className="flex-none bg-orange-400 hover:bg-orange-500 p-1 m-1 mb-2 rounded-lg cursor-pointer"
          onClick={prepPrintFullTable}>
          <PrinterOutline />
        </a>
        <button className="m-1 mb-2 p-1 flex-none bg-green-300 hover:bg-green-600 rounded-full" onClick={refreshTable}>
          <RefreshOutline />
        </button>
      </div>

      <table className="group w-full border-2">
        <THeadBuilder lists={allList} />

        <tbody>
          {allList.cons.data.map((i, conIndex) => {
            let conFiltered = scores.filter((el) => el.attributes.con === i.attributes.con_number.toString()); // mini drill
            let lowerIsBetter = 0;

            return (
              <tr key={i.id} className="table-control">
                <th className="table-control-th">{`N.${i.attributes.con_number}`}</th>

                {allList.cris.data.map((w) => {
                  let criFiltered = conFiltered.filter((el) => el.attributes.cri === w.id); // mini drill

                  return allList.juds.data.map((q) => {
                    let judFiltered = criFiltered.filter(
                      (el) => el.attributes.jud === q.attributes.jud_number.toString()
                      
                    ); // mini drill
                    let temp = distRanks(i.attributes.con_number.toString(), w.id, q.attributes.jud_number.toString());
                    lowerIsBetter += Number.isInteger(temp) ? temp : 0;

                    return showRawScores ? (
                      <td key={q.id} className="table-control">
                        {judFiltered.length !== 0 ? judFiltered[0].attributes.raw_score : "-"}
                      </td>
                    ) : (
                      <td key={q.id} className="table-control">
                        {distRanks(i.attributes.con_number.toString(), w.id, q.attributes.jud_number.toString())}
                      </td>
                    );
                  });
                })}

                <td className="table-control">{passbyCopy(lowerIsBetter)}</td>
                {/* SCORES render horizontally; but we need to capture data vertically */}
                {/* to accomodate for the timings we use USER intervention -> onclick */}
                <td className="table-control cursor-pointer" onClick={showFinalRanks}>
                  {finalRanks.length !== 0 ? finalRanks[conIndex] : "Click to show"}
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="table-control bg-gray-300"></td>
            {allList.cris.data.map((q) => {
              return allList.juds.data.map((w) => {
                return !q && !w ? null : checkRankValidity(q, w);
              });
            })}
            <td className="table-control bg-gray-300" colSpan={2}>
              checks
            </td>
          </tr>
        </tbody>
      </table>

      <FinalistTable ret={disableCoronation} />
    </div>
  );
}

function THeadBuilder({ lists }) {
  const prepPrintCrisTable = (c) => {
    localStorage.setItem("tobePrinted", JSON.stringify({ cri: c }));
  };

  return (
    <thead>
      <tr className="table-control">
        <th className="table-control-th" rowSpan={2}>
          Conts.
        </th>
        {lists.cris.data.map((i) => {
          return (
            <th key={i.id} className="table-control-th" colSpan={lists.juds.data.length}>
              <div className="flex">
                <span className="flex-auto tracking-widest">{i.attributes.name}</span>
                <a
                  href="/reports"
                  target="_blank"
                  className="flex-none bg-orange-400 hover:bg-orange-500 p-1 rounded-lg cursor-pointer"
                  onClick={() => prepPrintCrisTable(i.id)}>
                  <PrinterOutline />
                </a>
              </div>
            </th>
          );
        })}
        <th className="table-control-th" rowSpan={2}>
          Sum
        </th>
        <th className="table-control-th" rowSpan={2}>
          Final Ranks
        </th>
      </tr>
      <tr className="table-control">
        {lists.cris.data.map((element) => {
          return lists.juds.data.map((i) => {
            return (
              <th key={i.id} className="table-control-th">
                {i.attributes.jud_number ?? 0}
              </th>
            );
          });
        })}
      </tr>
    </thead>
  );
}
