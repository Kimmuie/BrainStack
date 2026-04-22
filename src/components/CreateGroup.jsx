// CreateGroup.jsx
import React, { useState, useEffect, useRef } from "react";
import ClickOutside from "./ClickOutside";

const CreateGroup = ({ onConfirm, onCancel, Header }) => {
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");

   const handleConfirm = () => {
    if (!editGroupName.trim()) return;
    onConfirm({ createName: editGroupName, createDescription: editGroupDescription });
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs flex items-center justify-center p-4 z-90 animate-popUp">
      <ClickOutside className="border-2 border-Primary bg-Darker-Primary rounded-xl shadow-lg max-w-sm w-full flex flex-col h-fit" onOutsideClick={onCancel}>
        <div className="flex flex-row justify-start items-center h-full mt-3 ml-3">
          <img src={Header == "Create Group" ? "/img/icon_member_gold.svg" : "/img/icon_case_gold.svg"} width="40" height="40" alt="alert" className="bg-Secondary p-2 rounded-full"/>
          <h3 className="text-lg font-prompt font-semibold text-Secondary ml-4">{Header}</h3>
        </div>
        <div className="p-4 gap-4 flex flex-col">
          <input 
              type="text" 
              placeholder={Header == "Create Group" ? "Group Name" : "Solution Name"}
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              className="border-2 border-Primary text-Primary w-full p-2 focus:outline-none focus:ring-0 focus:border-transparent bg-Secondary rounded-lg" />
          <textarea 
              type="text" 
              placeholder="Description" 
              value={editGroupDescription}
              onChange={(e) => setEditGroupDescription(e.target.value)}
              rows={5}
              className="border-2 border-Primary text-Primary w-full p-2 focus:outline-none focus:ring-0 focus:border-transparent bg-Secondary rounded-lg  resize-none" />
          </div>
        <div className="flex justify-end gap-2 mt-4  border-t-1 border-t-Secondary/60 p-2">
          <button
            onClick={handleConfirm}
            className="bg-Secondary text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer"
          >
            Create
          </button>
          <button
            onClick={onCancel}
            className="bg-custom-red text-[#FAF8F1] hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </ClickOutside>
    </div>
  );
};

export default CreateGroup;