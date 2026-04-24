import { useState, useEffect, useCallback } from "react";
import { fetchAPI } from "../service/fetchapi";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import MergeIdea from "../components/MergeIdea";
import EnhanceIdea from "../components/EnhanceIdea";

import { io, Socket } from "socket.io-client";
const socket = io("http://localhost:3000");

const ViewList = ({onViewChange}) => {
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const isGroupPage = pathParts[1] === 'group';
    const groupPath = isGroupPage ? pathParts[2] : null;
    const caseCode = isGroupPage ? pathParts[3] : null;
    const email = localStorage.getItem("email");
    const [currentCase, setCurrentCase] = useState({});
    const [currentView, setCurrentView] = useState("list");
    const [currentMode, setCurrentMode] = useState("");
    const [loading, setLoading] = useState(true);
    const [totalIdeas, setTotalIdeas] = useState(0);
    const [votedCount, setVotedCount] = useState(0);
    const [unvotedIdeas, setUnvotedIdeas] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [mergingIdea, setMergingIdea] = useState(false);
    const [enhancingIdea, setEnhancingIdea] = useState(false);
    const [mergingError, setMergingError] = useState(false);
    const { icons } = useTheme();  

    // ฟังก์ชันแก้ไขเส้นทางไอคอน
    const iconList = icons.list;
    const iconMindmap = icons.mindmap;

    const loadCase = useCallback(async () => {
        const data = await fetchAPI(`/groups/${groupPath}/groupCase/${caseCode}`, "GET");
        if (data) setCurrentCase(data.groupCase ?? {});
    }, [groupPath, caseCode]);

    useEffect(() => {
        const loadIdeas = async () => {
            setLoading(true);
            const data = await fetchAPI(`/groups/${groupPath}/groupCase/${caseCode}/caseIdeas`, "GET");
            if (data) {
                const ideas = data.groupCase ?? [];
                setTotalIdeas(ideas.length);
                const unvoted = ideas.filter(
                    (idea) => !idea.ideaVoteUser?.includes(email)
                );
                setUnvotedIdeas(unvoted);
                setVotedCount(ideas.length - unvoted.length);
            }
            setLoading(false);
        };
        loadIdeas();

        const reloadIdeas = async ({ groupCode, caseCode: incomingCaseCode }) => {
            if (groupCode !== groupPath) return;
            if (incomingCaseCode !== caseCode) return;
            
            console.log("✅ calling loadIdeas");
            await loadIdeas();
            await loadCase(); 
        };
        socket.on('caseIdea:created', reloadIdeas);
        socket.on('Vote:created', reloadIdeas);
        return () => {
            socket.off('caseIdea:created', reloadIdeas);
            socket.off('Vote:created', reloadIdeas);
        };
    }, [groupPath, caseCode, email]);

    useEffect(() => {
        if (!email) return;
        loadCase();

        const reloadCases = async ({ groupCode }) => {
            if(groupCode !== groupPath) return;

            loadCase();
        }

        socket.on('groupCase:created', reloadCases);
        return () => {
            socket.off('groupCase:created', reloadCases);
        };
    }, [groupPath, caseCode, email]);
    
    const handleSelect = useCallback((id) => {
        if (currentMode === "") return;
        if (currentMode === "enhance") {
        setSelectedIds((prev) => prev.includes(id) ? [] : [id]);
        return;
    }

        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    }, [currentMode]);

    const handleModeToggle = (mode) => {
        setCurrentMode((prev) => (prev === mode ? "" : mode));
        setSelectedIds([]);
    };

    const handleSubmit = () => {
        if (currentMode === "merge" && selectedIds.length > 1) {
            setMergingIdea(true);
        } else if (currentMode === "enhance") {
            setEnhancingIdea(true);
        } else {
            setMergingError(true);
             setTimeout(() => {
                setMergingError(false);
            }, 10000);
        }
    };

    return (
        <>
        <div className="flex flex-col transition-colors duration-300 animate-fadeInUp w-full h-full gap-4 lg:gap-10">
            <div className="border-2 border-Primary bg-Darker-Primary rounded-xl shadow-lg w-full flex flex-row h-full">
                <div className="flex flex-row justify-between items-center h-full mt-3 px-3">
                    <img src="/img/icon_case_gold.svg" width="40" height="40" alt="case" className="bg-Secondary p-2 rounded-full" />
                </div>
                <div className="flex flex-row justify-between w-full">
                    <div className="p-4 gap-4 flex flex-col">
                        <h1 className="text-Secondary text-sm font-bold">{currentCase.caseName}</h1>
                        <p className="text-Secondary text-sm">{currentCase.caseDescription || "No description provided."}</p>
                    </div>
                    <div className="flex justify-start my-2 border-l-1 border-l-Secondary/60 p-4 gap-4">
                        <p className="text-Secondary text-sm font-bold">
                            All Ideas : {totalIdeas} <br />
                            Voted Ideas : {votedCount} <br />
                            Unvoted Ideas : {Math.max(0, unvotedIdeas.length)}
                        </p>
                    </div>
                </div>
            </div>
            {/* Selection Bar */}
            {selectedIds.length > 0 && (
                <div className="flex flex-row items-center gap-4 px-4 py-3 bg-Darker-Primary border-2 border-Primary rounded-xl animate-fadeInUp">
                    <span className="text-Secondary text-sm font-bold">
                        {currentMode == "merge" && `${selectedIds.length}`} Idea{currentMode == "merge" && "s"} Selected {mergingError && "(Please select 2 ideas for merging)"}
                    </span>
                    <button
                        onClick={() => setSelectedIds([])}
                        className="text-Secondary text-sm underline cursor-pointer"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="ml-auto bg-Primary text-Secondary font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-Primary/80 transition-colors"
                    >
                        {currentMode === "merge" ? "Merge Selected" : "Enhance Selected"}
                    </button>
                </div>
            )}
            {mergingIdea && (
                <MergeIdea
                onCancel={() => setMergingIdea(false)}
                caseName={currentCase.caseName}
                caseDescription={currentCase.caseDescription || "No description provided."}
                selectedIdea={selectedIds}
                />
            )}
            {enhancingIdea && (
                <EnhanceIdea
                onCancel={() => setEnhancingIdea(false)}
                caseName={currentCase.caseName}
                caseDescription={currentCase.caseDescription || "No description provided."}
                selectedIdea={selectedIds}
                />
            )}
            <div className="flex flex-col h-full">
                <div className="flex flex-col-reverse gap-3 sm:gap-3 sm:flex-row w-full justify-between">
                    <div className="flex flex-row gap-3">
                        <button
                        onClick={() => handleModeToggle("merge")}
                        className={`${currentMode == "merge" ? "bg-Primary text-Secondary" : "bg-Darker-Secondary text-Primary"} w-full lg:w-50 whitespace-nowrap font-bold py-2  px-4 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors`}
                        >
                        Merge Ideas
                        </button>
                        <button
                        onClick={() => handleModeToggle("enhance")}
                        className={`${currentMode == "enhance" ? "bg-Primary text-Secondary" : "bg-Darker-Secondary text-Primary"} w-full lg:w-50 whitespace-nowrap font-bold py-2 px-4 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors`}
                        >
                        Enhance Ideas
                        </button>
                    </div>
                    <div className="flex flex-row gap-3">
                        <button
                        className="w-full py-0 sm:py-3 font-bold bg-Primary text-Secondary hover:text-Primary  px-0 sm:px-4 rounded-lg sm:rounded-b-none border-2 sm:border-b-0 border-Primary hover:bg-Darker-Secondary cursor-pointer transition-colors"
                        >
                        Sort by Voting
                        </button>
                        <div className="flex w-full">
                            <button
                            className={`${currentView == "list" ? "bg-Primary" : "cursor-pointer bg-Darker-Secondary hover:bg-Darker-Primary"} flex justify-center items-center font-bold px-4 h-full w-full rounded-tl-lg rounded-bl-lg sm:rounded-bl-none border-2 border-r-1 sm:border-b-0 border-Primary transition-colors`}
                            >
                            <img src={currentView == "list" ? `${iconList}` : "/img/icon_list_gold.svg"} width="40" height="40" alt="list" className="p-1"/>
                            </button>
                            <button
                            onClick={() => {
                                setCurrentView("mindmap");
                                onViewChange("mindmap");
                            }}
                            className={`${currentView == "mindmap" ? "bg-Primary" : "cursor-pointer bg-Darker-Secondary hover:bg-Darker-Primary"} flex justify-center items-center font-bold px-4 h-full w-full rounded-tr-lg rounded-br-lg sm:rounded-br-none border-2 border-l-1 sm:border-b-0 border-Primary transition-colors`}
                            >
                            <img src={currentView == "mindmap" ? `${iconMindmap}` : "/img/icon_mindmap_gold.svg"} width="40" height="40" alt="mindmap" className="p-1"/>
                            </button>
                        </div>
                    </div>
                </div>
                {currentCase.caseIdeas?.length === 0 ? (
                    <div className="flex justify-center w-full px-4 py-5 border-2 border-Primary text-Primary bg-Darker-Secondary text-base">
                        No ideas have been sent for this case yet.
                    </div>
                ) : (
                    <>
                    {(currentCase.caseIdeas ?? []).map((caseIdea, index) => (
                        <IdeaRow
                            key={caseIdea._id}
                            caseIdea={caseIdea}
                            index={index}
                            isFirst = {index === 0}
                            isLast = {index === currentCase.caseIdeas.length - 1}
                            currentMode = {currentMode}
                            onSelect={handleSelect}
                            isSelected={selectedIds.includes(caseIdea.ideaCode)}
                        />
                    ))}
                </>
                )}
            </div>
        </div>
        </>
    );
};

const IdeaRow = ({ caseIdea, index, isFirst, isLast, currentMode, onSelect, isSelected }) => {
    const[ openComment, setOpenComment ] = useState(false);
    const { icons } = useTheme();  
    
    const iconComment = icons.comment;


    const emailToName = async (email) => {
            const data = await fetchAPI(`/users/${email}`, "GET");
            if (data) return data.name;
            return email;
    }
    return (
    <div
        key={caseIdea._id ?? caseIdea.ideaDescription}
        className={` border-Primary bg-Darker-Secondary shadow-lg w-full flex flex-col justify-between
        ${isFirst ? "border-2" : "border-x-2 border-b-2"}
        ${isLast ? "rounded-b-md border-x-2 border-b-2" : ""}
        ${!isFirst && !isLast ? "rounded-none" : ""}
        `}
    >
        <div className="flex flex-col justify-between items-start">
            <div className="flex flex-row justify-between w-full items-start">
                <div className="flex flex-row justify-start items-start h-full p-4 gap-4">
                    <div className="gap-3 flex flex-col items-center">
                        <p className="text-Secondary bg-Primary rounded-xl px-2.5 py-1 text-xs w*full">
                            {index + 1}
                        </p>
                        {currentMode != "" &&
                        <button onClick={() => onSelect(caseIdea.ideaCode)}  className={`cursor-pointer border-2 border-Primary w-4 h-4 ${currentMode === "merge" ? "" : "rounded-full"}  ${isSelected ? "bg-Primary" : "bg-Secondary"}`} />
                        }
                    </div>
                    <div className="gap-2 flex flex-col w-full">
                        <p className="text-Secondary bg-Primary rounded-xl px-2 py-1 text-xs w-fit">
                            {useEmailToName(caseIdea.ideaCreateBy)}
                        </p>
                        <h1 className="text-Primary text-base font-bold w-full whitespace-pre-line break-all">
                            {caseIdea.ideaDescription}
                        </h1>
                    </div>
                </div>
                <div className="p-4 gap-2 flex flex-col">
                    <span className="text-Primary sm:px-2 text-sm font-bold flex flex-row items-center justify-center">
                    <img src="/img/icon_upvote_gold.svg" width="40" height="40" alt="list" className="sm:p-1"/>
                        {caseIdea.ideaUpvote}
                    </span>
                    <span className="text-Primary sm:px-2 text-sm font-bold flex flex-row items-center justify-center">
                    <img src="/img/icon_downvote_gold.svg" width="40" height="40" alt="list" className="sm:p-1"/>
                        {caseIdea.ideaDownvote}
                    </span>
                </div>
            </div>
            {openComment ? (
            <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full h-full p-4">
                {caseIdea.ideaComment.map((ideaComment) => (
                    <CommentCard
                        key={ideaComment.commentCode}
                        ideaComment={ideaComment}
                    />
                ))}
            </div>
            <button onClick={() => setOpenComment(false)} className="cursor-pointer hover:text-Darker-Primary animate-fadeInUp underline text-Primary pb-4 pl-4 text-sm font-bold flex flex-row items-center justify-center">
                Close Comment
            </button>
            </>
            ):(
            <>
                {caseIdea.ideaComment.length > 0 &&
                <button onClick={() => setOpenComment(true)} className="gap-3 flex flex-row items-center text-Secondary text-sm font-bold p-4 w-full ">
                    <div className="flex flex-row items-center gap-2 bg-Darker-Primary hover:bg-Primary cursor-pointer border-Primary pl-2 pr-4 rounded-md">
                        <img src={iconComment} width="40" height="40" alt="list" className="p-2"/>
                        Open Comment
                    </div>
                </button>
                }
            </>
            )
            }
            </div>
        </div>
    
    );
}

const CommentCard = ({ ideaComment }) => {
    const { icons } = useTheme();  
    const iconComment = icons.comment;

    const commenterName = useEmailToName(ideaComment.commentUser);
    return (
        <div key={ideaComment.commentCode} className="flex flex-row items-start gap-2 bg-Darker-Primary border-Primary pl-2 pr-4 h-full py-2 rounded-md animate-fadeInUp">
            <img src={iconComment} width="40" height="40" alt="comment" className="p-2"/>
            <div className="flex flex-col">
                <span className="text-Secondary text-sm font-bold break-all">{commenterName}</span>
                <span className="text-Secondary text-sm break-all">{ideaComment.commentData}</span>
            </div>
        </div>
    );
};

const useEmailToName = (email) => {
    const [name, setName] = useState(email)

    useEffect(() => {
        if (!email) return;
        const fetchName = async () => {
            const data = await fetchAPI(`/users/${email}`, "GET");
            if (data?.username) setName(data.username);
        };
        fetchName();
    }, [email]);

    return name;
};

export default ViewList;