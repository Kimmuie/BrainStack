// Navbar.jsx
import { useState, useRef } from "react";
import ClickOutside from "./ClickOutside";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import { fetchAPI } from "../service/fetchapi"

const Navbar = () => {
    const email = localStorage.getItem('email');
    const user = fetchAPI(`/users/${email}`, "GET")
    const userSettingRef = useRef(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isUsername, setIsUsername] = useState(user.username);
    const [isUserEmail, setIsUserEmail] = useState(email);

    return (
        <nav className="fixed z-50 bg-Secondary w-full h-20 flex items-center justify-between px-8 py-4 border-b-2 border-Primary">
        {/* Left */}
        <ul className="items-center flex space-x-6 animate-fadeInUp">
            <li className="text-Primary text-2xl font-bold">BrainStack</li>
            <li className="text-Secondary bg-Primary text-base font-bold border-2 px-3 py-1 rounded-full">
            All Group
            </li>
        </ul>

        {/* Right */}
        <div className="relative flex flex-row items-center justify-center gap-4 animate-fadeInUp">
            {isLogin ? (
            <>
                <h1 className="text-Primary text-base font-bold">Lorem Ipsum</h1>
                <button
                ref={userSettingRef}
                onClick={() => setIsUserOpen((prev) => !prev)}
                className="rounded-full border-2 border-Primary bg-Primary hover:bg-Darker-Primary cursor-pointer transition-colors duration-300"
                >
                <img src="/img/icon_user_dark.svg" alt="User" className="w-10 p-1.5" />
                </button>
            </>
            ) : (
            <SignIn
                setUser={(email) => {
                setIsLogin(true);
                console.log("User logged in:", email);
                }}
            />
            )}

            {/* User Setting Box */}
            {isUserOpen && (
            <ClickOutside
                onOutsideClick={() => setIsUserOpen(false)}
                ignoreRefs={[userSettingRef]}
                className="w-64 z-10 top-14 right-0 absolute bg-Primary text-Black rounded-xl shadow-md overflow-hidden flex justify-center flex-col px-4 py-4"
            >
                <div className="flex items-center just gap-3 p-4 border-b border-Primary/20">
                    <div className="overflow-hidden">
                        {isEditProfile ? (
                        <p className="text-Secondary text-sm font-bold truncate">Lorem Ipsum</p>
                        ) : (
                        <div className="flex flex-row w-full rounded-full border-2 bg-Darker-Secondary border-Primary py-1 px-1">
                            <input type="text" placeholder="Username" className="text-Primary w-full px-2 focus:outline-none focus:ring-0 focus:border-transparent" />
                            <button className="font-bold ml-4 bg-Primary text-Secondary px-3 py-1 rounded-full border-2 border-Primary hover:bg-Darker-Primary cursor-pointer transition-colors duration-300">
                                <img src="/img/icon_check_dark.svg" alt="Dark mode" className="w-6 h-6" />
                            </button>
                        </div>
                        )}
                        <p className="text-Secondary/60 text-xs truncate">lorem@example.com</p>
                    </div>
                </div>
                <div className="p-2">
                    {/* Name Changer - งานคิม */}
                    <button 
                        onClick={() => setIsEditProfile(prev => !prev)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-Secondary/10 transition-colors text-sm text-Secondary text-left cursor-pointer">
                        <img src="/img/icon_edit_dark.svg" alt="Edit" className="w-4 h-4" />
                        Edit profile
                    </button>
                    {/* Brightness Adjustment - งานคิม */}
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-Secondary/10 transition-colors text-sm text-Secondary text-left cursor-pointer">
                        <img src="/img/icon_moon_dark.svg" alt="Dark mode" className="w-4 h-4" />
                        Dark mode
                    </button>
                </div>
                <SignOut
                    setUser={(email) => {
                    setIsLogin(false);
                    setIsUserOpen(false);
                    console.log("User logged out:", email);
                    }}
                />
            </ClickOutside>
            )}
        </div>
        </nav>
    );
};

export default Navbar;