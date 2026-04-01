import { useState } from "react";

const GroupBox = () => {


  return (
    <>
        <div className="w-50 h-50 z-10 bg-Primary/80 hover:bg-Primary cursor-pointer border-2 border-Primary text-Black rounded-xl shadow-md overflow-hidden flex flex-col px-4 py-4 transition-colors duration-300">
            <div className="flex flex-row justify-between items-center">
              <div className="px-2 py-1 bg-Secondary/80 rounded-full mb-2 text-Primary text-xs font-bold flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-custom-red rounded-full"></div>
                No Tag
              </div>
              <div className="px-2 py-1 bg-Secondary/80 rounded-full mb-2 text-Primary text-xs font-bold flex items-center justify-center gap-1">          
                <img src="/img/icon_member_gold.svg" alt="Dark mode" className="w-4 h-4" />
                2
              </div>
            </div>
            <p className="text-Secondary text-sm font-bold text-clip">Lorem Ipsum</p>
            <p className="text-Secondary text-sm text-clip">Lorem ipsum dolor sit amet, consectetuer adipasdasdiscing elit. Aenean commodo ligula eget do</p>
        </div>
    </>
  );
};

export default GroupBox;
