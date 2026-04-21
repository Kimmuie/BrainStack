import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";
import ViewList from "../components/ViewList";
import ViewMindmap from "../components/ViewMindmap";

const IdeaPage = () => {
  const [ caseView, setCaseView ] = useState("list")

  const handleViewChange = (view) => {
    setCaseView(view);
    console.log("View changed to:", view);
  }

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-full sm:w-full lg::w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 py-8">
            {caseView === "list" ? (
              <ViewList onViewChange={handleViewChange}/>
            ) : (
              <ViewMindmap onViewChange={handleViewChange}/>
            )}
          </section>
      </div>
    </>
  );
};

export default IdeaPage;
