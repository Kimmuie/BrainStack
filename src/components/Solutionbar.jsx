import { useState, useEffect } from "react";
import CreateGroup from "./CreateGroup";
import { fetchAPI } from "../service/fetchapi";
import { useTheme } from "../contexts/ThemeContext";
import { useLocation } from "react-router-dom";

const SolutionBar = ({ onSolutionCreated }) => {
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const isGroupPage = pathParts[1] === 'group';
  const groupPath = isGroupPage ? pathParts[2] : null;
  const [enteredCode, setEnteredCode] = useState("");
  const email = localStorage.getItem('email');
  const [user, setUser] = useState(null);
  const { changeTheme, theme, icons } = useTheme();

  useEffect(() => {
    if (!email) return;
    const loadUser = async () => {
      const data = await fetchAPI(`/users/${email}`, "GET");
      if (data) setUser(data);
    };
    loadUser();
  }, [email]);


  const handleCreateSolution = async ({ createName, createDescription }) => {
    try {
      console.log("groupPath:", groupPath);
      const newSolution = await fetchAPI(`/groups/${groupPath}/groupCase`, "POST", {
        caseName: createName,
        caseDescription: createDescription
      });
      console.log("Create Solution Success", newSolution);
      setIsCreatingCase(false);
      onSolutionCreated();
    } catch (err) {
      console.error("Create Solution error:", err.message);
    }
  };

  return (
    <>
      <div className="flex flex-row w-full px-8 pt-7 gap-4  animate-fadeInUp">
        <input
          type="text"
          placeholder="Search Solution"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
          className=" w-full rounded-full border-2 border-Primary py-4 px-4 text-Primary focus:outline-none"
        />
        <button
          onClick={() => setIsCreatingCase(true)}
          className="w-50 font-bold bg-Primary text-Secondary px-4 py-2 rounded-full border-2 border-Primary hover:bg-Primary/80 cursor-pointer transition-colors"
        >
          Create Solution
        </button>
      </div>
      {isCreatingCase && (
        <CreateGroup
          Header={"Create Solution"}
          onConfirm={handleCreateSolution}
          onCancel={() => setIsCreatingCase(false)}
          caseName={""}
          caseDescription={""}
        />
      )}
    </>
  );
};

export default SolutionBar;