// Add above Navbar component
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../service/fetchapi";

const Dropdown = ({ groupCode, onSelect }) => {
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const load = async () => {
            const data = await fetchAPI(`/groups/${groupCode}`, "GET");
            if (data) setGroup(data);
        };
        load();
    }, [groupCode]);

    if (!group) return null;

    // Get initials from group name
    const initials = group.groupName
        .split(" ")
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <button
            onClick={() => { navigate(`/group/${group.groupCode}`); onSelect(); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-Primary/10 text-sm text-Primary transition-colors cursor-pointer"
        >
            <span className="w-7 h-7 rounded-md bg-Primary/20 flex items-center justify-center text-xs font-medium text-Primary flex-shrink-0">
                {initials}
            </span>
            {group.groupName}
        </button>
    );
};
export default Dropdown;