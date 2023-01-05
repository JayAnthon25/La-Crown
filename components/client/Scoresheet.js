import React, { useState, useEffect } from "react";
import { getCons, getScores, updateScores, createScores } from "./APIcalls";

export default function Scoresheet({ cris }) {
  const [cons, setCons] = useState([]);
  const [scores, setScores] = useState([]);
  const [ranks, setRanks] = useState([]);
  let newlyCreatedScore;
  useEffect(() => {
    getCons(setCons);
    getScores(cris, JSON.parse(sessionStorage.getItem("judNum")).judNum, setScores, setRanks);
  }, [cris]);

  const distScores = (con, isID) => {
    let filtered = scores.filter((el) => el.attributes.con === con.toString());
    if (filtered.length !== 0) return isID ? filtered[0].id : filtered[0].attributes.raw_score;
  };
  const distRanks = (raw) => {
    let filtered = scores.filter((el) => el.attributes.raw_score === raw);
    let index = scores.indexOf(filtered[0]);
    return index > -1 ? ranks[index] : "--";
  };
  const setNewlyCreatedScore = (str) => {
    newlyCreatedScore = str;
  };
  const scoreInputChanges = (e, scoreID, con, cri, jud) => {
    if (e.target.value === "") {
      // this is just to accomodate <empty string>; no update
      let copy = scores.slice();
      let filtered = copy.filter((el) => el.id === scoreID);
      copy[copy.indexOf(filtered[0])].attributes.raw_score = e.target.value;
      setScores(copy);
    }
    if (e.target.value >= 1 && e.target.value <= 10) {
      if (scoreID) {
        // scoreID is defined; this must be an update
        let copy = scores.slice(); // get a mutable copy of array
        let filtered = copy.filter((el) => el.id === scoreID); // get the targeted element
        copy[copy.indexOf(filtered[0])].attributes.raw_score = e.target.value; // change targeted attribute
        setScores(copy); // push a change on the state with copy
        updateScores(scoreID, parseInt(e.target.value));
      } else {
        // scoreID is not defined; this must be a create
        if (newlyCreatedScore !== con + cri + jud) {
          setNewlyCreatedScore(con + cri + jud);
          createScores(con, cri, jud, parseInt(e.target.value));
          getScores(cris, JSON.parse(sessionStorage.getItem("judNum")).judNum, setScores, setRanks);
        } else {
          console.log("duplicate create prevented");
        }
      }
    }
  };


  if (cons.length === 0) return null;
  return (
    <div>
      {cons.map((q) => {
        return (
          <div key={q.id} className="flex mb-1" title={q.attributes.name}>
            <div className="flex-none border-2 px-2 py-1 text-center border-gray-500 bg-gray-300 text-black rounded-l-md">
              {`Contestant No. ${q.attributes.con_number}`}
            </div>
            <div className="flex-auto border-2 text-center border-gray-400 bg-white border-x-0">
              <ScoreInput
                value={distScores(q.attributes.con_number, false)}
                onChange={scoreInputChanges}
                scoreID={distScores(q.attributes.con_number, true)}
                con={q.attributes.con_number}
                cri={cris}
              />
            </div>
            <div className="flex-auto border-2 px-2 py-1 text-center border-gray-400 bg-white rounded-r-md">
              {distRanks(distScores(q.attributes.con_number, false))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScoreInput({ value, onChange, scoreID, con, cri }) {
  let jud = JSON.parse(sessionStorage.getItem("judNum")).judNum;

  return (
    <input
      className="bg-inherit h-full w-full text-center"
      type="number"
      min={1}
      max={10}
      value={value ?? "--"}
      onChange={() => onChange(event, scoreID, con, cri, jud)}
    />
  );
}
