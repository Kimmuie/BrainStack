import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";
import SolutionBar from "../components/Solutionbar";
import SolutionBox from "../components/SolutionBox";

const GroupPage = () => {
  const [refresh, setRefresh] = useState(false);
  
  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 pb-8">
            <SolutionBar onSolutionCreated={() => setRefresh(prev => !prev)}/>
            <SolutionBox refresh={refresh} />
          </section>
      </div>
    </>
  );
};

export default GroupPage;
