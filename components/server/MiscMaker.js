import React, { useState, useEffect } from "react";
import { RefreshOutline } from "../shared/Icons";
import { getMisc, updateMisc } from "./APIcalls";

export default function MiscMaker({ title }) {
  const [contestName, setContestName] = useState("");
  const [clientToken, setClientToken] = useState("");
  const [serverToken, setServerToken] = useState("");
  const [finalistNum, setFinalistNum] = useState(0);
  const [disableCoronation, setDisableCoronation] = useState(false);
  useEffect(() => {
    getMisc(setClientToken, setServerToken, setFinalistNum, setContestName, setDisableCoronation);
  }, []);

  const refreshList = () => {
    getMisc(setClientToken);
  };
  const miscChanges = (e, id) => {
    switch (id) {
      case "contest_name":
        setContestName(e.target.value);
        updateMisc(id, `"${e.target.value}"`);
        break;
      case "client_token":
        setClientToken(e.target.value);
        updateMisc(id, `"${e.target.value}"`);
        break;
      case "server_token":
        setServerToken(e.target.value);
        updateMisc(id, `"${e.target.value}"`);
        break;
      case "finalist_number":
        setFinalistNum(e.target.value);
        updateMisc(id, e.target.value);
        break;
      case "disableCoronation":
        setDisableCoronation(e.target.checked);
        updateMisc(id, e.target.checked);
        break;
      default:
        break;
    }
  };

  return (
    <div className="border rounded-md border-gray-200 bg-white shadow-md">
      <div className="flex items-center">
        <div className="flex-auto text-xl font-extrabold ml-3 my-2">{title}</div>
        <button className="m-2 mr-3 p-1 flex-none bg-green-400 hover:bg-green-600 rounded-full" onClick={refreshList}>
          <RefreshOutline />
        </button>
      </div>
      <hr />

      <div className="overflow-y-auto pb-2" style={{ maxHeight: "40vh" }}>
        <small className="mx-4">Contest Name</small>
        <div className="flex items-center mx-3 mb-1">
          <div className="flex-auto">
            <TextInput value={contestName} onChange={miscChanges} id="contest_name" />
          </div>
        </div>

        <small className="mx-4">Client Token</small>
        <div className="flex items-center mx-3 mb-1">
          <div className="flex-auto">
            <TextInput value={clientToken} onChange={miscChanges} id="client_token" />
          </div>
        </div>

        <small className="mx-4">Server Token</small>
        <div className="flex items-center mx-3 mb-1">
          <div className="flex-auto">
            <TextInput value={serverToken} onChange={miscChanges} id="server_token" />
          </div>
        </div>

        <small className="mx-4">Number of Finalists</small>
        <div className="flex items-center mx-3 mb-1">
          <div className="flex-auto">
            <TextInput value={finalistNum} onChange={miscChanges} id="finalist_number" />
          </div>
        </div>

        <div className="form-check mx-3 mb-1">
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={disableCoronation}
            id="disableCoronation"
            onChange={() => miscChanges(event, "disableCoronation")}
          />
          <label className="inline-block cursor-pointer ml-1" htmlFor="disableCoronation">
            <small>Disable Coronation</small>
          </label>
        </div>
      </div>
    </div>
  );
}

function TextInput({ value, onChange, id }) {
  return (
    <input
      className="border border-black focus:outline-none block w-full px-3 py-1 rounded-md text-right"
      type="text"
      id={id}
      value={value}
      onChange={() => onChange(event, id)}
    />
  );
}
