import { useState, useEffect } from "react";
import { fetchAPI } from "../service/fetchapi";
import { useNavigate } from "react-router-dom";

const GroupBox = ({ refresh }) => {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-2 sm:px-4 lg:px-8 xl:px-0 w-full sm:w-fit xl:max-w-5xl pt-3">
        {groups.map((group) => (
          <GroupCard key={group.groupCode} group={group} />
        ))}
      </div>
    </>
  );
};

const GroupCard = ({ group }) => {
  const navigation = useNavigate();
  const memberCount = group.groupData?.groupUsers?.length ?? 0;
  const tag = group.groupCase?.caseName || null;

  return (
    <button 
      onClick={() => navigation(`/group/${group.groupCode}`)}
      className="w-full h-lg z-10 bg-Primary/80 hover:bg-Primary cursor-pointer border-2 border-Primary text-Black rounded-xl shadow-md overflow-hidden flex flex-col px-4 py-4 transition-colors duration-300 animate-fadeInUp">
      {/* Top row: Tag + Member count */}
      <div className="flex flex-row justify-between items-center">
        <div className="px-2 py-1 bg-Secondary/80 rounded-full mb-2 text-Primary text-xs font-bold flex items-center justify-center gap-1">
          <div
            className={`w-2 h-2 rounded-full ${tag ? "bg-custom-green" : "bg-custom-red"}`}
          />
          {tag ?? "No Tag"}
        </div>

        <div className="px-2 py-1 bg-Secondary/80 rounded-full mb-2 text-Primary text-xs font-bold flex items-center justify-center gap-1">
          <img
            src="/img/icon_member_gold.svg"
            alt="Members"
            className="w-4 h-4"
          />
          {memberCount}
        </div>
      </div>

      {/* Group name */}
      <p className="text-Secondary text-sm font-bold truncate">
        {group.groupName}
      </p>

      {/* Group description */}
      <p className="text-Secondary text-sm line-clamp-2">
        {group.groupDescription || "No description provided."}
      </p>
    </button>
  );
};

export default GroupBox;