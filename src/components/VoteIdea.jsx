// voteIdea.jsx
import React, { useState, useEffect } from "react";
import ClickOutside from "./ClickOutside";
import { useLocation } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";

const VoteIdea = ({ onConfirm, onCancel, caseName, caseDescription, groupPath, caseCode }) => {
  const email = localStorage.getItem("email");
  const [comment, setComment] = useState("");
  const [unvotedIdeas, setUnvotedIdeas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reload, setReload] = useState(false);

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
  }, [reload]);

  const currentIdea = unvotedIdeas[currentIndex];

  const handleVote = async (voteType) => {
    if (!currentIdea || submitting) return;
    setSubmitting(true);

    try {
      await fetchAPI(
        `/groups/${groupPath}/groupCase/${caseCode}/caseIdeas/${currentIdea.ideaCode}/vote`,
        "POST",
        {
          voteType,
          voterEmail: email,
          comment: comment.trim() || null,
        }
      );

      setVotedCount((prev) => prev + 1);
      setComment("");

      // Advance to next unvoted idea
      if (currentIndex + 1 < unvotedIdeas.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setReload(true)
      }
    } catch (err) {
      console.error("Vote error:", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const unvotedCount = unvotedIdeas.length - currentIndex;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-90 animate-popUp">
      <ClickOutside
        className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-15 w-full justify-center items-center"
        onOutsideClick={onCancel}
      >
        {/* Left panel */}
        <div className="border-2 border-Primary bg-Darker-Primary rounded-xl shadow-lg w-sm flex flex-col h-fit">
          <div className="flex flex-row justify-between items-center h-full mt-3 px-3">
            <img
              src="/img/icon_case_gold.svg"
              width="40"
              height="40"
              alt="case"
              className="bg-Secondary p-2 rounded-full"
            />
            {unvotedIdeas.length != 0 &&
            <button
              onClick={onCancel}
              className="bg-custom-red text-[#FAF8F1] hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer"
            >
              Leave
            </button>
            }
          </div>
          <div className="p-4 gap-4 flex flex-col">
            <h1 className="text-Secondary text-sm font-bold">{caseName}</h1>
            <p className="text-Secondary text-sm break-all">{caseDescription}</p>
          </div>
          <div className="flex justify-start mt-4 border-t-1 border-t-Secondary/60 p-4 gap-4">
            <p className="text-Secondary text-sm font-bold">
              All Ideas : {totalIdeas} <br />
              Voted Ideas : {votedCount} <br />
              Unvoted Ideas : {Math.max(0, unvotedIdeas.length - currentIndex)}
            </p>
          </div>
        </div>

        {/* Right panel*/}
        <div className="border-2 border-Primary bg-Darker-Primary rounded-xl shadow-lg w-sm flex flex-col h-fit">
          <div className="flex flex-row justify-start items-center h-full mt-3 ml-3">
            <img
              src="/img/icon_idea_gold.svg"
              width="40"
              height="40"
              alt="idea"
              className="bg-Secondary p-2 rounded-full"
            />
            <h3 className="text-lg font-prompt font-semibold text-Secondary ml-4">
              Vote Idea
            </h3>
            {!loading && unvotedIdeas.length > 0 && (
              <span className="ml-auto mr-3 text-xs text-Secondary/60">
                {currentIndex + 1} / {unvotedIdeas.length}
              </span>
            )}
          </div>

          <div className="p-4 gap-4 flex flex-col">
          {/* หน้าโหลด */}
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <p className="text-Secondary/60 text-sm">Loading ideas...</p>
              </div>
              // ไม่มีไอเดียเหลือให้โหวต
            ) : unvotedIdeas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 gap-2">
                <p className="text-Secondary text-sm font-bold">
                  You've voted on all ideas! 🎉
                </p>
                <button
                  onClick={onCancel}
                  className="bg-Secondary text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-6 rounded cursor-pointer text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              // หน้าโหวตปกติ
              <>
                <p className="text-Secondary text-sm break-words w-full text-start pr-5">
                  {currentIdea?.ideaDescription}
                </p>
                <textarea
                  placeholder="Add Comment (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="border-2 border-Primary text-Primary w-full p-2 focus:outline-none focus:ring-0 focus:border-transparent bg-Secondary rounded-lg resize-none"
                />
              </>
            )}
          </div>

          {!loading && unvotedIdeas.length > 0 && (
            <div className="flex justify-end gap-2 mt-4 border-t-1 border-t-Secondary/60 p-2">
              <button
                onClick={() => handleVote("agree")}
                disabled={submitting}
                className="w-full bg-custom-green text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer disabled:opacity-50"
              >
                Agree
              </button>
              <button
                onClick={() => handleVote("skip")}
                disabled={submitting}
                className="bg-Secondary text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer disabled:opacity-50"
              >
                Skip
              </button>
              <button
                onClick={() => handleVote("disagree")}
                disabled={submitting}
                className="w-full bg-custom-red text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer disabled:opacity-50"
              >
                Disagree
              </button>
            </div>
          )}
        </div>
      </ClickOutside>
    </div>
  );
};

export default VoteIdea;