import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAPI } from "../service/fetchapi";
import { useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
    ReactFlow, Background, Controls,
    useNodesState, useEdgesState,
    Handle, Position   // ← Fix 2: import Handle & Position
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MergeIdea from "../components/MergeIdea";
import EnhanceIdea from "../components/EnhanceIdea";

import { io, Socket } from "socket.io-client";
const socket = io("http://localhost:3000");

const CaseNode = ({ data }) => (
    <div className="bg-Primary text-Secondary rounded-xl px-5 py-3 shadow-lg border-2 border-Secondary flex flex-col items-center min-w-[160px]">
        <span className="text-xs font-bold opacity-70 leading-none mb-1">CASE</span>
        <span className="text-xs font-bold">{data.caseName}</span>
        <span className="text-sm font-bold text-center leading-tight">{data.caseDescription}</span>
        <Handle type="source" position={Position.Top} style={{ top: "70%", opacity: 0, transform: "translate(-50%, -50%)" }} />
    </div>
);

const IdeaNode = ({ data }) => {
    const { icons } = useTheme();
    const iconUpvote = icons.upvote;
    const iconDownvote = icons.downvote;
    const isSelected = data.selected;

    return (
        <div
            onClick={() => data.onSelect(data.id)}
            className={`cursor-grab active:cursor-grabbing rounded-xl px-4 py-3 shadow-md border-2 transition-colors min-w-28 max-w-xs ${isSelected ? "bg-Primary border-Secondary" : "bg-Darker-Secondary border-Primary hover:border-Darker-Primary"}`}
        >
            <Handle type="target" position={Position.Top} style={{ top: "70%", opacity: 0, transform: "translate(-50%, -50%)" }} />
            <span className={`text-xs leading-none px-2 py-0.5 rounded-xl mb-2 inline-block ${isSelected ? "bg-Secondary text-Primary" : "bg-Primary text-Secondary"}`}>
                {useEmailToName(data.creatorName)}
            </span>
            <p className={`text-sm font-bold mt-1 break-words leading-snug ${isSelected ? "text-Secondary" : "text-Primary"}`}>
                {data.ideaDescription}
            </p>
            <div className="flex flex-row gap-3 mt-2">
                <span className={`text-xs font-bold flex items-center gap-1 ${isSelected ? "text-Secondary" : "text-Primary"}`}>
                    <img src={isSelected ? `${iconUpvote}` : "/img/icon_upvote_gold.svg"} width="16" height="16" alt="up" />
                    {data.ideaUpvote}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${isSelected ? "text-Secondary" : "text-Primary"}`}>
                    <img src={isSelected ? `${iconDownvote}` : "/img/icon_downvote_gold.svg"} width="16" height="16" alt="down" />
                    {data.ideaDownvote}
                </span>
            </div>
        </div>
    );
};

const nodeTypes = {
    caseNode: CaseNode,
    ideaNode: IdeaNode,
};

const buildGraph = (currentCase, allIdeas, selectedIds, onSelect, savedPositions) => {
    const centerX = 400;
    const centerY = 300;
    const minRadius = 320;
    const perNodeSpread = 55;
    const radius = Math.max(minRadius, (allIdeas.length * perNodeSpread) / (2 * Math.PI));

    const caseNode = {
        id: "case",
        type: "caseNode",
        position: savedPositions["case"] ?? { x: centerX, y: centerY },
        draggable: true,
        data: {
            caseName: currentCase.caseName,
            caseDescription: currentCase.caseDescription ?? "",
        },
    };

    const ideaNodes = allIdeas.map((idea, index) => {
        const angle = (2 * Math.PI * index) / allIdeas.length - Math.PI / 2;
        const ideaId = String(idea.ideaCode ?? idea._id ?? idea.id ?? idea.ideaId ?? idea.idea_id ?? `idea-${index}`);

        const rawCreator = idea.ideaCreateBy;
        const creatorName =
            typeof rawCreator === "string"
                ? rawCreator
                : rawCreator?.name ?? rawCreator?.username ?? rawCreator?.email ?? "Unknown";

        return {
            id: ideaId,
            type: "ideaNode",
            position: savedPositions[ideaId] ?? {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            },
            draggable: true,
            data: {
                id: ideaId,
                ideaDescription: idea.ideaDescription,
                creatorName,
                ideaUpvote: idea.ideaUpvote ?? 0,
                ideaDownvote: idea.ideaDownvote ?? 0,
                ideaComments: idea.ideaComments ?? [],
                selected: selectedIds.includes(ideaId),
                onSelect,
            },
        };
    });

    const edges = allIdeas.map((idea, index) => {
        const ideaId = String(idea.ideaCode ?? idea._id ?? idea.id ?? idea.ideaId ?? idea.idea_id ?? `idea-${index}`);
        return {
            id: `edge-${ideaId}`,
            source: "case",
            target: ideaId,   
            style: { stroke: "var(--color-Primary, #c9a84c)", strokeWidth: 1.5 },
            animated: false,
        };
    });

    return { nodes: [caseNode, ...ideaNodes], edges };
};

const ViewMindmap = ({ onViewChange }) => {
    const location = useLocation();
    const pathParts = location.pathname.split("/");
    const isGroupPage = pathParts[1] === "group";
    const groupPath = isGroupPage ? pathParts[2] : null;
    const caseCode = isGroupPage ? pathParts[3] : null;
    const email = localStorage.getItem("email");
    const [currentView, setCurrentView] = useState("mindmap");

    const [currentCase, setCurrentCase] = useState({});
    const [currentMode, setCurrentMode] = useState("");
    const [loading, setLoading] = useState(true);
    const [totalIdeas, setTotalIdeas] = useState(0);
    const [votedCount, setVotedCount] = useState(0);
    const [unvotedIdeas, setUnvotedIdeas] = useState([]);
    const [allIdeas, setAllIdeas] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [mergingIdea, setMergingIdea] = useState(false);
    const [enhancingIdea, setEnhancingIdea] = useState(false);
    const [mergingError, setMergingError] = useState(false);
    const { icons } = useTheme();

    const iconList = icons.list;
    const iconMindmap = icons.mindmap;

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodePositions = useRef({});

    const handleNodesChange = useCallback((changes) => {
        changes.forEach((change) => {
            if (change.type === "position" && change.position) {
                nodePositions.current[change.id] = change.position;
            }
        });
        onNodesChange(changes);
    }, [onNodesChange]);

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

    useEffect(() => {
        if (!currentCase.caseName && allIdeas.length === 0) return;
        const { nodes: n, edges: e } = buildGraph(
            currentCase, allIdeas, selectedIds, handleSelect, nodePositions.current
        );
        setNodes(n);
        setEdges(e);
    }, [currentCase, allIdeas, selectedIds, handleSelect]);

    useEffect(() => {
        const loadIdeas = async () => {
            setLoading(true);
            const data = await fetchAPI(`/groups/${groupPath}/groupCase/${caseCode}/caseIdeas`, "GET");
            if (data) {
                const ideas = Array.isArray(data)
                    ? data
                    : Array.isArray(data.caseIdeas) ? data.caseIdeas
                    : Array.isArray(data.ideas) ? data.ideas
                    : Array.isArray(data.groupCase) ? data.groupCase
                    : [];
                setAllIdeas(ideas);
                setTotalIdeas(ideas.length);
                const unvoted = ideas.filter((idea) => !idea.ideaVoteUser?.includes(email));
                setUnvotedIdeas(unvoted);
                setVotedCount(ideas.length - unvoted.length);
            }
            setLoading(false);
        };
        loadIdeas();

        const reloadIdeas = async ({ groupCode }) => {
            if(groupCode !== groupPath) return;
            
            loadIdeas();
        };
        socket.on('caseIdea:created', reloadIdeas);
        return () => {
            socket.off('caseIdea:created', reloadIdeas);
        };
    }, [groupPath, caseCode, email]);

    useEffect(() => {
        if (!email) return;
        const loadCase = async () => {
            const data = await fetchAPI(`/groups/${groupPath}/groupCase/${caseCode}`, "GET");
            if (data) setCurrentCase(data.groupCase ?? data ?? {});
        };
        loadCase();
    }, [groupPath, caseCode, email]);

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
            setTimeout(() => setMergingError(false), 10000);
        }
    };

    return (
        <div className="flex flex-col transition-colors duration-300 animate-fadeInUp w-full h-full">
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-row gap-3 w-full">
                    <button
                        onClick={() => handleModeToggle("merge")}
                        className={`${currentMode === "merge" ? "bg-Primary text-Secondary" : "bg-Darker-Secondary text-Primary"} text-sm sm:text-base font-bold px-4 py-2 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors`}
                    >
                        Merge Ideas
                    </button>
                    <button
                        onClick={() => handleModeToggle("enhance")}
                        className={`${currentMode === "enhance" ? "bg-Primary text-Secondary" : "bg-Darker-Secondary text-Primary"} text-sm sm:text-base font-bold px-4 py-2 rounded-t-lg border-2 border-b-0 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors`}
                    >
                        Enhance Ideas
                    </button>
                </div>
                <div className="flex flex-row gap-3 w-full justify-end">
                    <div>
                        <button
                            onClick={() => { setCurrentView("list"); onViewChange("list"); }}
                            className={`${currentView === "list" ? "bg-Primary" : "cursor-pointer bg-Darker-Secondary hover:bg-Darker-Primary"} font-bold px-4 h-full rounded-tl-lg border-2 border-r-1 border-b-0 border-Primary transition-colors`}
                        >
                            <img src={currentView === "list" ? `${iconList}` : "/img/icon_list_gold.svg"} width="40" height="40" alt="list" className="p-1"/>
                        </button>
                        <button
                            className={`${currentView === "mindmap" ? "bg-Primary" : "cursor-pointer bg-Darker-Secondary hover:bg-Darker-Primary"} font-bold px-4 h-full rounded-tr-lg border-2 border-l-1 border-b-0 border-Primary transition-colors`}
                        >
                            <img src={currentView === "mindmap" ? `${iconMindmap}` : "/img/icon_mindmap_gold.svg"} width="40" height="40" alt="mindmap" className="p-1"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full rounded-b-xl border-2 border-Primary overflow-hidden h-[calc(100vh-35vh)]">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-Secondary text-sm">
                        Loading...
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}   // ← Fix 3: use wrapper
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        minZoom={0.4}
                        maxZoom={2}
                    >
                        <Background color="#c9a84c" gap={24} size={0.5} />
                        <Controls />
                    </ReactFlow>
                )}
            </div>

            {selectedIds.length > 0 && (
                <div className="flex flex-row items-center gap-4 px-4 py-3 bg-Darker-Primary border-2 border-Primary rounded-xl animate-fadeInUp mt-3">
                    <span className="text-Secondary text-sm font-bold">
                        {currentMode === "merge" && `${selectedIds.length}`} Idea{currentMode === "merge" && "s"} Selected {mergingError && "(Please select 2 ideas for merging)"}
                    </span>
                    <button onClick={() => setSelectedIds([])} className="text-Secondary text-sm underline cursor-pointer">
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
        </div>
    );
};

const useEmailToName = (email) => {
    const [name, setName] = useState(email);
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

export default ViewMindmap;