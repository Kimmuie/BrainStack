import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";
import SolutionBar from "../components/Solutionbar";
import SolutionBox from "../components/SolutionBox";

const GroupPage = () => {
  const { groupPath } = useParams();
  const [refresh, setRefresh] = useState(false);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const loadGroup = async () => {
      const data = await fetchAPI(`/groups/${groupPath}`, "GET");
      if (data) setGroup(data);
    };
    loadGroup();
  }, [groupPath]);

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 pb-8">
            <SolutionBar onSolutionCreated={() => setRefresh(prev => !prev)}/>
            <SolutionBox />
          </section>
      </div>
    </>
  );
};

export default GroupPage;
