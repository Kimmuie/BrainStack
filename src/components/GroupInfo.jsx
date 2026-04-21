import { useState, useEffect } from "react";
import CreateGroup from "./CreateGroup";
import { fetchAPI } from "../service/fetchapi";

const GroupInfo = () => {
  const pathParts = location.pathname.split('/');
  const isGroupPage = pathParts[1] === 'group';
  const groupPath = isGroupPage ? pathParts[2] : null;
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("email");

    useEffect(() => {
    if (!email) return;

    const loadGroups = async () => {
      setLoading(true);
      const data = await fetchAPI(`/groups/${groupPath}`, "GET");
      if (data) setGroups(data);
      setLoading(false);
    };

    loadGroups();
  }, []);

  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(groups.groupCode)
  };

  return (
    <>
      <div className="flex flex-row w-full xl:w-lg gap-4 h-full xl:h-screen animate-fadeInUp">
          <div className="border-2 border-Primary bg-Darker-Primary rounded-xl shadow-lg w-full flex flex-row h-full">
              <div className="flex flex-col justify-start w-full">
                <div className="flex flex-row justify-start items-center w-full h-fit gap-2 px-4 pt-4">
                  <div className="flex flex-row justify-between items-center w-full h-full gap-2">
                      <img src="/img/icon_member_gold.svg" width="40" height="40" alt="member" className="bg-Secondary p-2 rounded-full" />
                      <p className="text-Secondary text-sm font-bold w-full">{groups.groupData?.groupUsers?.length ?? 0} Members</p>
                  </div>
                  <button onClick={handleCopyJoinCode} className="cursor-pointer flex flex-row justify-center items-center h-fit gap-2 text-Primary rounded-full bg-Secondary hover:bg-Primary hover:text-Secondary border-2 border-Secondary text-sm  font-bold w-full">
                    Join Code: {groups.groupCode}
                  </button>
                </div>
                <div className="p-4  gap-4 flex flex-col">
                    <h1 className="text-Primary text-sm font-bold bg-Secondary p-1 rounded-full items-center flex justify-center">{groups.groupName}</h1>
                    <p className="text-Secondary text-sm whitespace-pre-line ">{groups.groupDescription || "No description provided."}</p>
                </div>
              </div>
          </div>
      </div>
    </>
  );
};

export default GroupInfo;