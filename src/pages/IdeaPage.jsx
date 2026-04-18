import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";
import ViewList from "../components/ViewList";

const IdeaPage = () => {
  const [ caseView, setCaseView ] = useState("list")

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 py-8">
            <ViewList/>
          </section>
      </div>
    </>
  );
};

export default IdeaPage;
