import { useState, useEffect } from "react";
import CreateGroup from "./CreateGroup";
import { fetchAPI } from "../service/fetchapi";
import { useTheme } from "../contexts/ThemeContext";

const Toolsbar = ({ onGroupCreated }) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const { changeTheme, theme, icons } = useTheme();

  const iconFilterOff = icons.filterOff;
  const iconFilterOn = icons.filterOn;

  useEffect(() => {
    if (!email) return;
    const loadUser = async () => {
      const data = await fetchAPI(`/users/${email}`, "GET");
      if (data) setUser(data);
    };
    loadUser();
  }, [email]);

  const handleJoinGroup = async () => {
    if (!enteredCode.trim()) return;

    try {
      const result = await fetchAPI(`/groups/${enteredCode}/join`, "POST", {
        email: user.email,
      });

      if (result?.success) {
        setEnteredCode("");
        onGroupCreated();
      } else {
        console.warn("Failed to join group.");
      }

    } catch (err) {
      console.error("Join Group error:", err.message);
    }
  };


  const handleCreateGroup = async ({ createName, createDescription }) => {
    if (!user?.email) { 
        console.error("User not loaded yet");
        return;
    }
    try {
      const newGroup = await fetchAPI('/groups', "POST", {
        groupName: createName,
        groupDescription: createDescription,
        creatorEmail: user.email,
      });
      console.log("Create Group Success", newGroup);
      setIsCreatingGroup(false);
      onGroupCreated();
    } catch (err) {
      console.error("Create Group error:", err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row w-full px-2 gap-2 sm:gap-4 sm:px-4 lg:px-8 pt-7 animate-fadeInUp">
        <div className="flex flex-row w-full rounded-full border-2 border-Primary py-2 px-2">
          <input
            type="text"
            placeholder="Add Group with Code"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            className="text-Primary text-xs sm:text-base w-full px-0 sm:px-4 focus:outline-none focus:ring-0 focus:border-transparent"
          />
          <button
            onClick={handleJoinGroup}
            className="text-xs sm:text-base font-bold ml-4 bg-Primary text-Secondary px-1 sm:px-3 py-1 sm:py-1 w-50 rounded-full border-2 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors"
          >
            Join Group
          </button>
        </div>
        <div className="flex flex-row w- gap-2 sm:gap-4">
        <button
          onClick={() => setIsCreatingGroup(true)}
          className="w-full sm:w-50 text-xs sm:text-base font-bold bg-Primary text-Secondary px-1 sm:px-3 py-1 sm:py-1 rounded-full border-2 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors"
        >
          Create Group
        </button>
        <button className="w-fit font-bold bg-Primary px-2 sm:px-4 py-0 sm:py-2 rounded-full border-2 border-Primary hover:Primary hover:bg-Darker-Primary cursor-pointer transition-colors">
          <img src={iconFilterOff} alt="Filter" className="w-6 sm:w-10 h-10 " />
        </button>
        </div>
      </div>
      {isCreatingGroup && (
        <CreateGroup
          Header={"Create Group"}
          onConfirm={handleCreateGroup}
          onCancel={() => setIsCreatingGroup(false)}
          groupName={""}
          groupDescription={""}
        />
      )}
    </>
  );
};

export default Toolsbar;