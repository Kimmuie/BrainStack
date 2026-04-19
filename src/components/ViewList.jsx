import { useState, useEffect } from "react";
import { fetchAPI } from "../service/fetchapi";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";

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
    const { icons } = useTheme();  

    // ฟังก์ชันแก้ไขเส้นทางไอคอน
    const iconList = icons.list;
    const iconMindmap = icons.mindmap;

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
    }, [groupPath, caseCode, email]);

    useEffect(() => {
        if (!email) return;
        const loadCase = async () => {
            setLoading(true);
            const data = await fetchAPI(`/groups/${groupPath}/groupCase/${caseCode}`, "GET");
            if (data) setCurrentCase(data.groupCase ?? {});
            setLoading(false);
        };
        loadCase();
    }, [groupPath, caseCode, email]);
    

    return (
        <>
        <div className="flex flex-col transition-colors duration-300 animate-fadeInUp w-full h-full gap-10">
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
            <div className="flex flex-col h-full">
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row gap-3">
                    <button
                    onClick={currentMode != "merge" ? () => setCurrentMode("merge") : () => setCurrentMode("")}
                    className={`${currentMode == "merge" ? "bg-Primary text-Secondary" : "bg-Darker-Secondary text-Primary"} w-50 font-bold  px-4 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors`}
                    >
                    Merge Ideas
                    </button>
                    <button
                    onClick={currentMode != "enhance" ? () => setCurrentMode("enhance") : () => setCurrentMode("")}
                    className={`${currentMode == "enhance" ? "bg-Primary text-Secondary" : "bg-Darker-Secondary text-Primary"} w-50 font-bold px-4 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors`}
                    >
                    Enhance Ideas
                    </button>
                </div>
                <div className="flex flex-row gap-3">
                    <button
                    className="font-bold bg-Primary text-Secondary hover:text-Primary px-4 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Darker-Secondary cursor-pointer transition-colors"
                    >
                    Sort by Voting
                    </button>
                    <div>
                        <button
                        // onClick={() => {
                        //     setCurrentView("list");
                        //     onViewChange("list");
                        // }}
                        className={`${currentView == "list" ? "bg-Primary" : "cursor-pointer bg-Darker-Secondary hover:bg-Darker-Primary"} font-bold px-4 h-full rounded-tl-lg border-2 border-r-1 border-b-0 border-Primary transition-colors`}
                        >
                        <img src={currentView == "list" ? `${iconList}` : "/img/icon_list_gold.svg"} width="40" height="40" alt="list" className="p-1"/>
                        </button>
                        <button
                        onClick={() => {
                            setCurrentView("mindmap");
                            onViewChange("mindmap");
                        }}
                        className={`${currentView == "mindmap" ? "bg-Primary" : "cursor-pointer bg-Darker-Secondary hover:bg-Darker-Primary"} font-bold px-4 h-full rounded-tr-lg border-2 border-l-1 border-b-0 border-Primary transition-colors`}
                        >
                        <img src={currentView == "mindmap" ? `${iconMindmap}` : "/img/icon_mindmap_gold.svg"} width="40" height="40" alt="mindmap" className="p-1"/>
                        </button>
                    </div>
                </div>
            </div>
            {(currentCase.caseIdeas ?? []).map((caseIdea, index) => (
                <IdeaRow
                    key={caseIdea._id}
                    caseIdea={caseIdea}
                    index={index}
                    isFirst = {index === 0}
                    isLast = {index === currentCase.caseIdeas.length - 1}
                    currentMode = {currentMode}
                />
            ))}
            </div>
        </div>
        </>
    );
};

const IdeaRow = ({ caseIdea, index, isFirst, isLast, currentMode }) => {
    const[ selectedIdea, setSelectedIdea ] = useState(false);
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
                        <button onClick={() => setSelectedIdea(prev => !prev)} className={`cursor-pointer border-2 border-Primary w-4 h-4 ${selectedIdea ? "bg-Primary" : "bg-Secondary"}`} />
                        }
                    </div>
                    <div className="gap-2 flex flex-col w-full">
                        <p className="text-Secondary bg-Primary rounded-xl px-2 py-1 text-xs w-fit">
                            {useEmailToName(caseIdea.ideaCreateBy)}
                        </p>
                        <h1 className="text-Primary text-base font-bold w-full">
                            {caseIdea.ideaDescription}
                        </h1>
                    </div>
                </div>
                <div className="p-4 gap-2 flex flex-col">
                    <span className="text-Primary px-2 text-sm font-bold flex flex-row items-center justify-center">
                    <img src="/img/icon_upvote_gold.svg" width="40" height="40" alt="list" className="p-1"/>
                        {caseIdea.ideaUpvote}
                    </span>
                    <span className="text-Primary px-2 text-sm font-bold flex flex-row items-center justify-center">
                    <img src="/img/icon_downvote_gold.svg" width="40" height="40" alt="list" className="p-1"/>
                        {caseIdea.ideaDownvote}
                    </span>
                </div>
            </div>
            {openComment ? (
            <>
            <div className="grid grid-cols-4 gap-2 w-full h-full p-4">
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