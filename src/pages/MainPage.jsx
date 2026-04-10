import { useState } from "react";
import Toolsbar from "../components/Toolsbar";
import Display from "../components/Display";
import GroupBox from "../components/GroupBox";

const MainPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 pb-8">
            <Display />
            <Toolsbar onGroupCreated={() => setRefresh(prev => !prev)}/>
            <GroupBox refresh={refresh}/>
          </section>
      </div>
    </>
  );
};

export default MainPage;
