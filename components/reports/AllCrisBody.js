import React, { useState, useEffect } from "react";
import { getAllLists, getAllScores } from "../server/APIcalls";

export default function AllCrisBody() {
  const [allLists, setAllLists] = useState({ cons: { data: [] }, juds: { data: [] }, cris: { data: [] } });
  const [scores, setScores] = useState([]);
  let ontheflyArray = [];
  const [finalRanks, setFinalRanks] = useState([]);
  useEffect(() => {
    getAllLists(setAllLists);
    getAllScores(setScores);
  }, []);

  const rankingMini = (cri, con) => {
    let criFiltered = scores.filter((el) => el.attributes.cri === cri);
    let judIDs = allLists.juds.data.map((e) => e.attributes.jud_number.toString());
    let tobeReturned = 0;
    judIDs.forEach((q) => {
      let judFiltered = criFiltered.filter((el) => el.attributes.jud === q);
      // ranking mechanism
      let arr = judFiltered.map((raw) => raw.attributes.raw_score);
      let sorted = arr.slice().sort((a, b) => b - a);
      let ranks = arr.map((v) => sorted.indexOf(v) + 1);
      // get targeted con
      let targeted = judFiltered.filter((el) => el.attributes.con === con);
      tobeReturned += ranks[judFiltered.indexOf(targeted[0])] ?? 0;
      // console.log(ranks[judFiltered.indexOf(targeted[0])]);
    });

    return tobeReturned;
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
            <th className="table-control-th">Num</th>
            <th className="table-control-th">Name</th>
            {allLists.cris.data.map((q) => {
              return (
                <th key={q.id} className="table-control-th">
                  {q.attributes.name}
                </th>
              );
            })}
            <th className="table-control-th">Sum</th>
            <th className="table-control-th">Ranks</th>
          </tr>
        </thead>

        <tbody>
          {allLists.cons.data.map((q, conIndex) => {
            let sum = 0;

            return (
              <tr key={q.id}>
                <td className="table-control">{q.attributes.con_number}</td>
                <td className="table-control">{q.attributes.name}</td>

                {allLists.cris.data.map((w) => {
                  sum += rankingMini(w.id, q.attributes.con_number.toString());

                  return (
                    <td key={w.id} className="table-control">
                      {rankingMini(w.id, q.attributes.con_number.toString())}
                    </td>
                  );
                })}

                <td className="table-control">{passbyCopy(sum)}</td>
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
            {allLists.juds.data.map((e) => {
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
