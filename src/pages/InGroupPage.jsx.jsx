import { useState } from "react";
import Toolsbar from "../components/Toolsbar";
import Display from "../components/Display";
import GroupBox from "../components/GroupBox";

const MainPage = () => {

  const groupExample = [
        { name: "ธรรมดา", path: "service_1", image: "/img/service_1.jpg" },
        { name: "พิเศษ", path: "service_2", image: "/img/service_2.jpg" },
        { name: "แขวนคอยล์", path: "service_3", image: "/img/service_3.jpg" },
        { name: "ตัดล้างใหญ่", path: "service_4", image: "/img/service_4.jpg" },
        { name: "ตัดล้างใหญ่", path: "service_4", image: "/img/service_4.jpg" },
        { name: "ตัดล้างใหญ่", path: "service_4", image: "/img/service_4.jpg" },
  ];


  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden">
          <section className="w-6xl bg-Secondary flex flex-col items-center min-h-screen px-8 pb-8">
            <Display />
            <Toolsbar />
          < div className="grid grid-cols-5 gap-2 max-w-5xl pt-3">
              {groupExample.map((item) => ( 
                  <GroupBox/>
              ))}
            </div>
          </section>
      </div>
    </>
  );
};

export default MainPage;
