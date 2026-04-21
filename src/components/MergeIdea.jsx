// CreateGroup.jsx
import React, { useState, useEffect, useRef } from "react";
import ClickOutside from "./ClickOutside";
import { useLocation } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";

const MergeIdea = ({ onCancel, caseName, caseDescription, selectedIdea }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const isGroupPage = pathParts[1] === 'group';
  const groupPath = isGroupPage ? pathParts[2] : null;
  const caseCode = isGroupPage ? pathParts[3] : null;
  const [ideaDescription, setIdeaDescription] = useState("");
  const [openCase, setOpenCase] = useState(false);
  const [openAi, setOpenAi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIdeasData, setSelectedIdeasData] = useState([]);

   const handleConfirm = () => {
    if (!ideaDescription.trim()) return;
    onConfirm({ ideaDescription: ideaDescription });
  };

  
  useEffect(() => {
      const loadIdeas = async () => {
          setLoading(true);
          const data = await fetchAPI(`/groups/${groupPath}/groupCase/${caseCode}/caseIdeas`, "GET");
          if (data) {
              const ideas = data.groupCase ?? [];
              const filtered = ideas.filter((idea) => selectedIdea.includes(idea.ideaCode));
              setSelectedIdeasData(filtered);
          }
          setLoading(false);
      };
      loadIdeas();
  }, [groupPath, caseCode]);

  return (
    <div className="fixed inset-0  backdrop-blur-xs flex items-center justify-center gap-30 p-4 z-90 animate-popUp">
      {/* Left Box */}
      <div className="-z-20 relative flex flex-row justify-start items-start h-full py-17" onOutsideClick={onCancel}>
        <div className="border-2 border-Primary bg-Darker-Primary rounded-xl shadow-lg w-sm flex flex-col h-full" >
          <div className="flex flex-row justify-start items-center h-fit mt-3 ml-3">
            <img src="/img/icon_idea_gold.svg" width="40" height="40" alt="alert" className="bg-Secondary p-2 rounded-full"/>
            <h3 className="text-lg font-prompt font-semibold text-Secondary ml-4">Selected Ideas</h3>
          </div>
          <div className="p-4 gap-4 flex flex-col max-h-full overflow-y-auto">
              {selectedIdeasData.map((idea) => (
                  <div key={idea.ideaCode} className="border-2 border-Primary rounded-lg p-3 bg-Secondary">
                      <p className="text-Primary text-sm break-words w-full text-start">
                          {idea.ideaDescription}
                      </p>
                  </div>
              ))}
          </div>
        </div>
      </div>
        {/* Right Box */}
      <div className="relative flex flex-row justify-center items-start" onOutsideClick={onCancel}>
      <div className="flex flex-col justify-center gap-1 items-center absolute left-0">
        <button 
          onClick={() => setOpenAi(prev => !prev)}
          className={`${openAi ? "-translate-x-full" : "-translate-x-14"} duration-600 top-0 gap-3 -z-10 flex max-w-xs bg-Darker-Primary hover:bg-Primary cursor-pointer p-2 border-y-2 border-l-2 border-Primary text-Black rounded-l-xl shadow-md overflow-hidden flex-row justify-between`}>
          <img src="/img/icon_gemini_gold.svg" width="40" height="40" alt="alert" className="bg-Secondary p-2 rounded-full"/>
          <button className="text-Primary bg-Secondary hover:bg-Primary hover:text-Secondary duration-300 border-2 border-Secondary cursor-cell rounded-full text-sm font-bold break-words truncate px-4 py-3">
            Merge With Gemini
          </button>

        </button>
        <button 
          onClick={() => setOpenCase(prev => !prev)}
          className={` ${openCase ? "-translate-x-full" : "-translate-x-15"} duration-600 top-0 -z-10 flex max-w-xs bg-Darker-Primary hover:bg-Primary cursor-pointer p-2 border-y-2 border-l-2 border-Primary text-Black rounded-l-xl shadow-md overflow-hidden flex-row justify-between`}>
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
        </div>
        <div className="border-2 border-Primary bg-Darker-Primary rounded-b-xl rounded-r-xl shadow-lg w-sm flex flex-col h-fit" >
          <div className="flex flex-row justify-start items-center h-full mt-3 ml-3">
            <img src="/img/icon_idea_gold.svg" width="40" height="40" alt="alert" className="bg-Secondary p-2 rounded-full"/>
            <h3 className="text-lg font-prompt font-semibold text-Secondary ml-4">Merge Idea</h3>
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
      </div>
    </div>
  );
};

export default MergeIdea;