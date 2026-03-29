const API = import.meta.env.VITE_API_URL || 'http:localhost:3000';

// ==================== Groups ====================
export const createGroup = async (groupName) => {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/api/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupName, creatorEmail: email })
  });
  return res.json();
};

export const getGroup = async (groupCode) => {
  const res = await fetch(`${API}/api/groups/${groupCode}`);
  return res.json();
};

export const joinGroup = async (groupCode) => {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/api/groups/${groupCode}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.json();
};

// ==================== Ideas ====================
export const addIdea = async (groupCode, ideaDescription) => {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/api/groups/${groupCode}/idea`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ideaDescription, ideaCreateBy: email })
  });
  return res.json();
};

export const upvoteIdea = async (groupCode, index) => {
  const res = await fetch(`${API}/api/groups/${groupCode}/idea/${index}/upvote`, {
    method: "PUT"
  });
  return res.json();
};

export const downvoteIdea = async (groupCode, index) => {
  const res = await fetch(`${API}/api/groups/${groupCode}/idea/${index}/downvote`, {
    method: "PUT"
  });
  return res.json();
};

// ==================== Comments ====================
export const addComment = async (groupCode, index, commentData) => {
  const email = localStorage.getItem("email");
  const res = await fetch(`${API}/api/groups/${groupCode}/idea/${index}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ commentData, commentUser: email })
  });
  return res.json();
};