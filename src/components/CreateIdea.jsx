// CreateGroup.jsx
import React, { useState, useEffect, useRef } from "react";
import ClickOutside from "./ClickOutside";

const CreateIdea = ({ onConfirm, onCancel, caseName, caseDescription }) => {
  const [ideaDescription, setIdeaDescription] = useState("");
  const [openCase, setOpenCase] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setOpenCase(true);
      }, 300);
    }, []);

   const handleConfirm = () => {
    if (!ideaDescription.trim()) return;
    onConfirm({ ideaDescription: ideaDescription });
  };

  return (
    <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center p-4 z-90 animate-popUp">
      <ClickOutside className="relative flex flex-row justify-center items-start" onOutsideClick={onCancel}>
      <button 
        onClick={() => setOpenCase(prev => !prev)}
        className={`absolute left-0 ${openCase ? "-translate-x-full" : "-translate-x-14"} duration-600 top-0 -z-10 flex max-w-xs bg-Darker-Primary hover:bg-Primary cursor-pointer p-2 border-y-2 border-l-2 border-Primary text-Black rounded-l-xl shadow-md overflow-hidden flex-row justify-between`}>
        <img src="/img/icon_case_gold.svg" width="40" height="40" alt="alert" 
            className="bg-Secondary p-2 rounded-full"/>
        <div className="w-full flex-col flex justify-start items-start px-4 py-4">
          <p className="text-Secondary text-sm font-bold break-words truncate">
            {caseName}
          </p>
          <p className="text-Secondary text-sm break-words w-full text-start pr-5">
            {caseDescription}
          </p>
        </div>
      </button>
        <div className="border-2 border-Primary bg-Darker-Primary rounded-b-xl rounded-r-xl shadow-lg w-sm flex flex-col h-fit" >
          <div className="flex flex-row justify-start items-center h-full mt-3 ml-3">
            <img src="/img/icon_idea_gold.svg" width="40" height="40" alt="alert" className="bg-Secondary p-2 rounded-full"/>
            <h3 className="text-lg font-prompt font-semibold text-Secondary ml-4">Create Idea</h3>
          </div>
          <div className="p-4 gap-4 flex flex-col">
            <textarea 
                type="text" 
                placeholder="Start an Idea" 
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                rows={15}
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
        </div>
      </ClickOutside>
    </div>
  );
};

export default CreateIdea;