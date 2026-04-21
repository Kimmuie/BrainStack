import { useState } from "react";

const Display = () => {

  return (
    <>
        <div className="mt-5 flex flex-col items-center justify-center gap-6 animate-fadeInUp">
            <img src="/img/icon_brain_gold.svg" alt="Profile" className="w-10" />
            <h1 className="font-playwrite text-Tertiary text-4xl sm:text-5xl font-bold">Think Together,</h1>
            <h1 className="font-playwrite text-Primary text-4xl sm:text-6xl font-bold">Discuss Together</h1>
            <span className="text-Tertiary text-base sm:text-xl font-mono opacity-70 w-full sm:w-lg text-center">Join groups, share knowledge, and level up your idea — all in one place.</span>
        </div>
    </>
  );
};

export default Display;
