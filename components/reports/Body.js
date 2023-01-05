import React, { useEffect, useState } from "react";
import { getSingleCri, getCri, getJud, getCon } from "./APIcalls";
import { getRawFinalistData, getAllScores } from "../server/APIcalls";

export default function Body() {
  const [scores, setScores] = useState([]);
  const [cri, setCri] = useState({ attributes: { name: "Coronation" } });
  const [jud, setJud] = useState([]);
  const [con, setCon] = useState([]);
  let ontheflyArray = [];
  const [finalRanks, setFinalRanks] = useState([]);
  useEffect(() => {
    // fetching scores; "all" or specific segment
    getSingleCri(JSON.parse(localStorage.getItem("tobePrinted")).cri, setScores);
    // fetching segment details
    getCri(JSON.parse(localStorage.getItem("tobePrinted")).cri, setCri);
    // fetching all judges
    getJud(setJud);
    // fetching contestants; "coronation" or anything else
    JSON.parse(localStorage.getItem("tobePrinted")).cri === "-1" ? getRawFinalistData(setCon) : getCon(setCon);
  }, []);

  const distRanks = (q, w) => {
    // cri already filtered
    let judFiltered = scores.filter((el) => el.attributes.jud === q);
    // ranking
    let arr = judFiltered.map((raw) => raw.attributes.raw_score);
    let sorted = arr.slice().sort((a, b) => b - a);
    let ranks = arr.map((v) => sorted.indexOf(v) + 1);
    // get target index
    let targeted = judFiltered.filter((el) => el.attributes.con === w);
    let targetIndex = judFiltered.indexOf(targeted[0]);

    return ranks.length !== 0 ? ranks[targetIndex] : "-";
  };
  const ordinals = (q) => {
    let x = "";
    switch (q) {
      case 1:
        return <span className="text-blue-800">1st</span>;
      case 2:
        return <span className="text-blue-800">2nd</span>;
      case 3:
        return <span className="text-blue-800">3rd</span>;
      default:
        return <span>{`${q}th`}</span>;
    }
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
  };

  return (
    <div>
      <table className="w-full mt-3 bg-white">
        <thead>
          <tr>
            <th className="table-control-th" rowSpan={2}>
              Num
            </th>
            <th className="table-control-th" rowSpan={2}>
              Name
            </th>
            <th className="table-control-th" colSpan={jud.length}>
              {cri.attributes.name}
            </th>
            <th className="table-control-th" rowSpan={2}>
              Sum
            </th>
            <th className="table-control-th" rowSpan={2}>
              Ranks
            </th>
          </tr>
          <tr>
            {jud.map((e) => {
              return (
                <th key={e.id} className="table-control-th">
                  {`Jud.${e.attributes.jud_number}`}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {con.map((e, conIndex) => {
            // let conFiltered = scores.filter((el) => el.attributes.con === e.attributes.con_number.toString());
            let lowerIsBetter = 0;

            return (
              <tr key={e.id}>
                <td className="table-control">{e.attributes.con_number}</td>
                <td className="table-control">{e.attributes.name}</td>

                {jud.map((w) => {
                  // let judFiltered = conFiltered.filter((el) => el.attributes.jud === w.id);
                  let temp = distRanks(w.attributes.jud_number.toString(), e.attributes.con_number.toString());
                  lowerIsBetter += Number.isInteger(temp) ? temp : 0;

                  return (
                    <td key={w.id} className="table-control">
                      {/* {`${judFiltered.length !== 0 ? judFiltered[0].attributes.raw_score : "-"} / ${distRanks(
                        w.id,
                        e.attributes.con_number.toString()
                      )}`} */}
                      {ordinals(distRanks(w.attributes.jud_number.toString(), e.attributes.con_number.toString()))}
                    </td>
                  );
                })}

                <td className="table-control">{passbyCopy(lowerIsBetter)}</td>
                <td className="table-control cursor-pointer bg-orange-300" onClick={showFinalRanks}>
                  {finalRanks.length !== 0 ? ordinals(finalRanks[conIndex]) : "Click to show"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="text-center overline font-bold mt-10">Chief of Tabulation Committee</div>

      <div className="font-bold mt-5">Judge Signatures:</div>
      <table className="w-full mt-5">
        <thead>
          <tr>
            {jud.map((e) => {
              return (
                <th key={e.id}>
                  <hr className="border-1 border-black mx-3" />
                  <div>{e.attributes.name}</div>
                  <span className="text-sm text-gray-400">{`Judge #${e.attributes.jud_number}`}</span>
                </th>
              );
            })}
          </tr>
        </thead>
      </table>
    </div>
  );
}
