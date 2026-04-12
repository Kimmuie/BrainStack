import { useState, useEffect } from "react";
import { fetchAPI } from "../service/fetchapi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

const SolutionBox = ({ refresh }) => {
  const email = localStorage.getItem("email");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const loadGroups = async () => {
      setLoading(true);
      const data = await fetchAPI(`/users/${email}/groups`, "GET");
      if (data) setGroups(data);
      setLoading(false);
    };

    loadGroups();
  }, [refresh]);

  // แสดงสถานะโหลด 
  if (loading) {
    return (
      <>
      <div className="grid grid-cols-5 gap-2 max-w-5xl pt-3">
        {[...Array(groups.length)].map((_, i) => (
          <div
            key={i}
            className="w-50 h-28 bg-Primary/40 rounded-xl animate-pulse"
          />
        ))}
      </div>
      </>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex justify-center w-full px-4 pt-5 text-Primary text-base">
        You haven't joined any groups yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-5 gap-2 max-w-5xl pt-3">
        {groups.map((group) => (
          <SolutionCard key={group.groupCode} group={group} />
        ))}
      </div>
    </>
  );
};

const SolutionCard = ({ group }) => {
  const navigation = useNavigate();
  const memberCount = group.groupData?.groupUsers?.length ?? 0;
  const tag = group.groupCase?.caseName || null;
  const { changeTheme, theme, icons } = useTheme();  

  // ฟังก์ชันแก้ไขเส้นทางไอคอน
  const iconAdd = icons.add;
  const iconVote = icons.vote;

  return (
    <>
    <div className="flex flex-row  transition-colors duration-300 animate-fadeInUp">
      <button 
        onClick={() => navigation(`/group/${group.groupCode}`)}
        className="w-50 z-10 bg-Primary/80 hover:bg-Primary cursor-pointer border-2 border-Primary text-Black rounded-l-xl shadow-md overflow-hidden flex flex-row justify-between">
        <div className="flex-col flex justify-center items-center px-4 py-4 ">
          <p className="text-Secondary text-sm font-bold truncate">
            {group.groupName}
          </p>
          <p className="text-Secondary text-sm line-clamp-2">
            {group.groupDescription || "No description provided."}
          </p>
        </div>
      </button>
        <div className="flex flex-col justify-center items-center h-full">
          <button className=" bg-Primary/80 hover:bg-Primary cursor-pointer h-full px-4 border-t-2 border-r-2 border-b-1 border-Primary rounded-tr-xl">
            <img src={iconAdd} alt="Add" className="w-12" />
          </button>
          <button className=" bg-Primary/80 hover:bg-Primary cursor-pointer h-full px-4 border-b-2 border-r-2 border-t-1 border-Primary rounded-br-xl">
            <img src={iconVote} alt="Vote" className="w-12" />
          </button>
        </div>
    </div>
    </>
  );
};

export default SolutionBox;