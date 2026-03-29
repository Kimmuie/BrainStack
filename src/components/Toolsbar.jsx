import { useState } from "react";

const Toolsbar = () => {


  return (
    <>
      <div className="flex flex-row w-full px-8 pt-7 animate-fadeInUp">
        {/* Search Bar - หลังกด join Group จะ Fetch หาด้วยรหัสที่ Input ไปว่ามีกลุ่มไหนตรงกันไหม หากมีให้เพิ่ม Group -> User/Groups */}
        <div className="flex flex-row w-full rounded-full border-2 border-Primary py-2 px-2">
          <input type="text" placeholder="Add Group with Code" className="text-Primary w-full px-4 focus:outline-none focus:ring-0 focus:border-transparent" />
          <button className="font-bold ml-4 bg-Primary text-Secondary px-3 py-1 w-50 rounded-full border-2 border-Primary hover:bg-Darker-Primary cursor-pointer transition-colors duration-300">Join Group</button>
        </div>
        {/* Create Group - เพิ่ม Group เข้า Doc มั Field: ID, ชื่อ etc.*/}
        <button className="w-50 font-bold ml-4 bg-Primary text-Secondary px-4 py-2 rounded-full border-2 border-Primary hover:bg-Secondary hover:text-Primary cursor-pointer ">Create Group</button>
      </div>
    </>
  );
};

export default Toolsbar;
