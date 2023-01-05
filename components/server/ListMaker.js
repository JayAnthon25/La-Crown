import { useState, useEffect } from "react";
import { RefreshOutline, TrashOuline, PencilOutline, ArrowRightOutline, CloseOutline } from "../shared/Icons";
import { getList, createListItem, delListItem, updateListItem } from "./APIcalls";

export default function ListMaker({ title }) {
  const [list, setList] = useState([]);
  const [newListItem, setNewListItem] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [focused, setFocused] = useState(null);
  useEffect(() => {
    getList(title.toLowerCase().substring(0, 3), setList);
  }, [title]);

  // refresh list
  const refreshList = () => {
    getList(title.toLowerCase().substring(0, 3), setList);
  };
  // update
  const cancelUpdate = () => {
    setFocused(null);
    refreshList();
  };
  const listChanges = (e, i, q) => {
    let copy = list.slice();
    if (q === "cnum") copy[i].attributes.con_number = e.target.value;
    if (q === "jnum") copy[i].attributes.jud_number = e.target.value;
    if (q === "name") copy[i].attributes.name = e.target.value;
    setList(copy);
    setFocused(i);
  };
  const sendUpdate = (listIndex, dbID) => {
    updateListItem(
      list[focused].attributes.name,
      list[focused].attributes.con_number ?? list[focused].attributes.jud_number,
      dbID,
      title.toLowerCase().substring(0, 3),
      cancelUpdate
    );
  };
  // create
  const listDraft = (e) => {
    setNewListItem(e.target.value);
  };
  const creatingSuccess = (newItem) => {
    let copy = list.slice();
    copy.push(newItem);
    setList(copy);
    setNewListItem("");
    setAddingNew(false);
  };
  const sendNew = () => {
    // console.log(newListItem);
    createListItem(newListItem, title.toLowerCase().substring(0, 3), creatingSuccess);
  };
  // delete
  const deleteSuccess = (listIndex) => {
    let copy = list.slice();
    copy.splice(listIndex, 1);
    setList(copy);
  };
  const deleteListItem = (dbID, listIndex) => {
    delListItem(dbID, listIndex, title.toLowerCase().substring(0, 3), deleteSuccess);
  };

  return (
    <div className="border rounded-md border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="flex-auto text-xl font-extrabold ml-3 my-2">{`${title} (${list.length})`}</div>
        <button className="m-2 mr-3 p-1 flex-none bg-green-400 hover:bg-green-600 rounded-full" onClick={refreshList}>
          <RefreshOutline />
        </button>
      </div>
      <hr />

      <div className="overflow-y-auto" style={{ maxHeight: "40vh" }}>
        {list.map((item, index) => {
          return (
            <div key={item.id} className="flex items-center mx-3 my-2">
              {/* visible only on Contestants and Judges view */}
              {title !== "Criteria" && (
                <div className="flex-a">
                  <ConNumber
                    value={item.attributes.con_number ?? item.attributes.jud_number ?? 0}
                    onChange={listChanges}
                    indx={index}
                    name={title === "Judges" ? "jnum" : "cnum"}
                  />
                </div>
              )}
              {/* textfield / display --> cRud --- visible everytime */}
              <div className="flex-auto">
                <TextInput value={item.attributes.name} onChange={listChanges} indx={index} />
              </div>

              {/* button for editing --> crUd --- visible when not onupdate */}
              <button
                className={`${
                  focused === index ? "flex-none" : "hidden"
                } ml-1 p-0.5 bg-green-100 hover:bg-green-300 rounded-full`}
                onClick={() => sendUpdate(index, item.id)}>
                <PencilOutline />
              </button>

              {/* button for deleting --> cruD --- visible when not onupdate */}
              <button
                className={`${
                  focused === index ? "hidden" : "flex-none"
                } ml-1 p-0.5 bg-red-100 hover:bg-red-300 rounded-full`}
                onClick={() => deleteListItem(item.id, index)}>
                <TrashOuline />
              </button>

              {/* button for canceling update --- visible only onupdate*/}
              <button
                className={`${
                  focused === index ? "flex-none" : "hidden"
                } ml-1 p-0.5 bg-red-100 hover:bg-red-300 rounded-full`}
                onClick={cancelUpdate}>
                <CloseOutline />
              </button>
            </div>
          );
        })}

        {/* textfield for adding --> Crud --- visible when onAddButtonClicked */}
        <div className={`${addingNew ? "flex" : "hidden"} items-center mx-3 my-2`}>
          <button
            className="flex-none mr-1 p-0.5 bg-gray-200 hover:bg-gray-400 rounded-full"
            onClick={() => setAddingNew(false)}>
            <TrashOuline />
          </button>
          <div className="flex-auto">
            <TextInput value={newListItem} onChange={listDraft} />
          </div>
          <button className="flex-none ml-1 p-0.5 bg-gray-200 hover:bg-gray-400 rounded-full" onClick={sendNew}>
            <ArrowRightOutline />
          </button>
        </div>
      </div>

      {/* Add button */}
      <hr />
      <button
        className="w-full py-1 rounded-b-md text-center bg-blue-500 hover:bg-blue-700 text-white"
        onClick={() => setAddingNew(addingNew ? false : true)}>
        Add another...
      </button>
    </div>
  );
}

function ConNumber({ value, onChange, indx, name }) {
  return (
    <input
      className="border border-gray focus:outline-none block w-20 px-3 py-1 rounded-md"
      type="number"
      value={value}
      onChange={() => onChange(event, indx, name)}
    />
  );
}

function TextInput({ value, onChange, indx }) {
  return (
    <input
      className="border border-gray focus:outline-none block w-full px-3 py-1 rounded-md"
      type="text"
      value={value}
      onChange={() => onChange(event, indx, "name")}
    />
  );
}