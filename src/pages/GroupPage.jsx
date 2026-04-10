import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";
import Toolsbar from "../components/Toolsbar";
import Display from "../components/Display";
import GroupBox from "../components/GroupBox";

const GroupPage = () => {
  const { groupPath } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const loadGroup = async () => {
      const data = await fetchAPI(`/Brainstack/groups/${groupPath}`, "GET");
      if (data) setGroup(data);
    };
    loadGroup();
  }, [groupPath]);

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 pb-8">
            <Toolsbar />
          </section>
      </div>
    </>
  );
};

export default GroupPage;
