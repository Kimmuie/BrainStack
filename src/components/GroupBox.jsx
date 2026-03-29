import { useState } from "react";

const GroupBox = () => {


  return (
    <>
        <div className="w-50 h-50 z-10 bg-Primary/80 hover:bg-Primary cursor-pointer border-2 border-Primary text-Black rounded-xl shadow-md overflow-hidden flex justify-center flex-col px-4 py-4 transition-colors duration-300">
            <p className="text-Secondary text-sm font-bold truncate">Lorem Ipsum</p>
        </div>
    </>
  );
};

export default GroupBox;
