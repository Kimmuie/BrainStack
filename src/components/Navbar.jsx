// Navbar.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import ClickOutside from "./ClickOutside";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import { fetchAPI } from "../service/fetchapi"
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const isGroupPage = pathParts[1] === 'group';
    const groupPath = isGroupPage ? pathParts[2] : null;
    const [groupName, setGroupName] = useState(null);
    const email = localStorage.getItem('email');
    const [user, setUser] = useState(null);
    const userSettingRef = useRef(null);
    const [isLogin, setIsLogin] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [editUsername, setEditUsername] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const { changeTheme, theme, icons } = useTheme();  

    // ฟังก์ชันแก้ไขเส้นทางไอคอน
    const iconUser = icons.user;
    const iconEdit = icons.edit;
    const iconTheme = icons.theme;
    const iconCheck = icons.check;

    // โหลดข้อมูลผู้ใช้เข้า เวลาล็อคอิน, กดเซฟไรงี้
    useEffect(() => {
        if (!email) return;
        const loadUser = async () => {
            const data = await fetchAPI(`/users/${email}`, "GET");
            if (data) {
                setUser(data);
                setEditUsername(data.username || '');
                setIsLogin(true);
            }
        };
        loadUser();
    }, [email, isSaving]);

    // โหลดข้อมูลกลุ่มถ้าอยู่ในหน้า group
    useEffect(() => {
        if (!groupPath) return;
        const loadGroup = async () => {
            const data = await fetchAPI(`/groups/${groupPath}`, "GET");
            if (data) setGroupName(data.groupName);
        };
        loadGroup();
    }, [groupPath]);

    // ฟังก์ชันเซฟชื่อผู้ใช้ใหม่
    const handleSaveUsername = async () => {
        if (!editUsername.trim() || editUsername === user?.username) {
            setIsEditProfile(false);
            return;
        }
        setIsSaving(true);
        
         try {
            const updated = await fetchAPI(`/users/${email}`, "PATCH", { username: editUsername });
            if (updated) {
                setUser(updated);
                setIsEditProfile(false)
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
        setIsSaving(false);
    };

    // ฟังก์ชันเปลี่ยนธีม
    const handleChangeTheme = async () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        changeTheme(newTheme);
        try {
            const updated = await fetchAPI(`/users/${email}`, "PATCH", { theme: newTheme });
            if (updated) {
                setUser(prev => ({ ...prev, ...updated }));
            }
        } catch (err) {
            console.error("Theme update failed:", err);
            changeTheme(user.theme);
        }
    };

    return (
        <nav className="fixed z-50 bg-Secondary w-full h-20 flex items-center justify-between px-8 py-4 border-b-2 border-Primary">
        {/* Left */}
        <ul className="items-center flex space-x-6 animate-fadeInUp">
            <button onClick={() => navigate("/home")} className="flex flex-row items-center gap-2">
                <img src="/img/brainstack_logo.png" alt="Profile" className="w-15" />
                <li className="text-Primary text-2xl font-bold">BrainStack</li>
            </button>
            <li className="text-Secondary bg-Primary text-base font-bold border-2 px-3 py-1 rounded-full">
            {isGroupPage && groupName ? groupName : "All Group"}
            </li>
        </ul>

        {/* Right */}
        <div className="relative flex flex-row items-center justify-center gap-4 animate-fadeInUp">
            {isLogin ? (
            <>
                <button
                ref={userSettingRef}
                onClick={() => setIsUserOpen((prev) => !prev)}
                className="flex flex-row items-center justify-center space-x-6 cursor-pointer"
                >
                    <h1 className="text-Primary text-base font-bold">{user.username ? (user.username) : ("None")}</h1>
                    <img src={iconUser} alt="User" className="w-10 p-1.5 rounded-full border-2 border-Primary bg-Primary hover:bg-Darker-Primary " />
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
                onOutsideClick={() => {setIsUserOpen(false), setIsEditProfile(false)}}
                ignoreRefs={[userSettingRef]}
                className="w-64 z-10 top-14 right-0 absolute bg-Primary text-Black rounded-xl shadow-md overflow-hidden flex justify-center flex-col px-4 py-4"
            >
                <div className={`flex flex-col items-start just gap-1 border-b border-Primary/20 ${isEditProfile ? "p-2" : "p-4"}`}>
                    {!isEditProfile ? (
                    <p className="text-Secondary text-sm font-bold truncate">{isLogin && user.username ? (user.username) : ("None")}</p>
                    ) : (
                    <div className="flex flex-row w-full rounded-lg border-2 bg-Secondary border-Primary py-1 px-1">
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveUsername()}
                            className="text-Primary w-full px-2 focus:outline-none focus:ring-0 focus:border-transparent" />
                        <button 
                            onClick={handleSaveUsername}
                            disabled={isSaving || !editUsername.trim()}
                            className="font-bold ml-4 bg-Primary text-Secondary px-3 py-1 rounded-sm border-2 border-Primary hover:bg-Darker-Primary cursor-pointer transition-colors duration-300">
                            <img src={iconCheck} alt="Dark mode" className="w-6 h-6" />
                        </button>
                    </div>
                    )}
                    <p className="text-Secondary/60 text-xs truncate">{user.email}</p>
                </div>
                <div className="p-2">
                    {/* Name Changer - งานคิม */}
                    <button 
                        onClick={() => setIsEditProfile(prev => !prev)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-Secondary/10 text-sm text-Secondary text-left cursor-pointer">
                        <img src={iconEdit} alt="Edit" className="w-4 h-4" />
                        Edit profile
                    </button>
                    {/* Brightness Adjustment - งานคิม */}
                    <button 
                        onClick={handleChangeTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-Secondary/10 text-sm text-Secondary text-left cursor-pointer">
                        <img src={iconTheme} alt="Dark mode" className="w-4 h-4" />
                        {theme == "dark" ? "Dark" : "Light"} Theme
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