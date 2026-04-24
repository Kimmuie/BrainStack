import { useState, useEffect } from "react";
import { fetchAPI } from "../service/fetchapi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import CreateIdea from "./CreateIdea";
import VoteIdea from "./VoteIdea";

import { io, Socket } from "socket.io-client";
const socket = io("http://localhost:3000");

const SolutionBox = ({ refresh }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const isGroupPage = pathParts[1] === 'group';
  const groupPath = isGroupPage ? pathParts[2] : null;
  const email = localStorage.getItem("email");
  const [groupCases, setGroupCases] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!email) return;

    const loadCase = async () => {
      setLoading(true);
      const data = await fetchAPI(`/groups/${groupPath}`, "GET");
      if (data) setGroupCases(data.groupCase ?? []);
      setLoading(false);
    };

    loadCase();

    const reloadCases = async ({ groupCode }) => {
      if(groupCode !== groupPath) return;

      loadCase();
    }

    socket.on('groupCase:created', reloadCases);
    return () => {
      socket.off('groupCase:created', reloadCases);
    };
  }, [refresh]);

  // แสดงสถานะโหลด 
  if (loading) {
    return (
      <>
      <div className="grid grid-cols-2 gap-2 max-w-5xl pt-3">
        {[...Array(groupCases.length)].map((_, i) => (
          <div
            key={i}
            className="w-50 h-28 bg-Primary/40 rounded-xl animate-pulse"
          />
        ))}
      </div>
      </>
    );
  }

  if (groupCases.length === 0) {
    return (
      <div className="flex justify-center w-full px-4 pt-5 text-Primary text-base">
        This group haven't created any solution yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 max-w-5xl pt-3">
        {groupCases.map((groupCase) => (
          <SolutionCard key={groupCase.caseCode} group={groupCase} />
        ))}
      </div>
    </>
  );
};

const SolutionCard = ({ group }) => {
  const [isCreatingIdea, setIsCreatingIdea] = useState(false);
  const [isVotingIdea, setIsVotingIdea] = useState(false);
  const email = localStorage.getItem("email");
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const isGroupPage = pathParts[1] === 'group';
  const groupPath = isGroupPage ? pathParts[2] : null;
  const navigation = useNavigate();
  const { icons } = useTheme();

  const handleCreateIdea = async ({ ideaDescription }) => {
    try {
      const newIdea = await fetchAPI(`/groups/${groupPath}/groupCase/${group.caseCode}/caseIdeas`, "POST", {
        ideaDescription: ideaDescription,
        ideaCreateBy: email,
      });
      console.log("Create Idea Success", newIdea);
      setIsCreatingIdea(false);
    } catch (err) {
      console.error("Create Idea error:", err.message);
    }
  };

  return (
    <>
    <div className="flex flex-row transition-colors duration-300 animate-fadeInUp">
      <button
        onClick={() => navigation(`/group/${groupPath}/${group.caseCode}`)}
        className="w-full z-10 bg-Primary/80 hover:bg-Primary cursor-pointer border-2 border-Primary text-Black rounded-l-xl shadow-md overflow-hidden flex flex-row justify-between">
        <div className="w-full flex-col flex justify-start items-start px-4 py-4">
          <p className="text-Secondary text-sm font-bold break-words truncate">
            {group.caseName}
          </p>
          <p className="text-Secondary text-sm break-words w-54 h-20 text-start whitespace-pre-line truncate">
            {group.caseDescription || "No description provided."}
          </p>
        </div>
      </button>
      <div className="flex flex-col justify-center items-center h-full">
        <button 
          onClick={() => setIsCreatingIdea(true)}
        className="bg-Primary/80 hover:bg-Primary cursor-pointer h-full px-4 border-t-2 border-r-2 border-b-1 border-Primary rounded-tr-xl">
          <img src={icons.add} alt="Add" className="w-12" />
        </button>
        <button 
          onClick={() => setIsVotingIdea(true)}
          className="bg-Primary/80 hover:bg-Primary cursor-pointer h-full px-4 border-b-2 border-r-2 border-t-1 border-Primary rounded-br-xl">
          <img src={icons.vote} alt="Vote" className="w-12" />
        </button>
      </div>
    </div>
      {isCreatingIdea && (
        <CreateIdea
          onConfirm={handleCreateIdea}
          onCancel={() => setIsCreatingIdea(false)}
          caseName={group.caseName}
          caseDescription={group.caseDescription || "No description provided."}
          ideaDescription={""}
        />
      )}
      {isVotingIdea && (
        <VoteIdea
          onConfirm={handleCreateIdea}
          onCancel={() => setIsVotingIdea(false)}
          caseName={group.caseName}
          caseDescription={group.caseDescription || "No description provided."}
          ideaDescription={""}
          groupPath={groupPath}
          caseCode={group.caseCode}
        />
      )}
    </>
  );
};

export default SolutionBox;