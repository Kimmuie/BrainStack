import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../firebase";

const API = import.meta.env.VITE_API_URL || 'http:localhost:3000'

// ==================== Register ====================
export const register = async (email, password, username) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await fetch(`${API}/Brainstack/users`, { //gfgj
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        username: username,
        theme: "light"
      })
    });

    return user;
  } catch (err) {
    console.error("Register error:", err.message);
    throw err;
  }
};
// test
// ==================== Login ====================
export const login = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem("email", result.user.email);

    return result.user;
  } catch (err) {
    console.error("Login error:", err.message);
    throw err;
  }
};

// ==================== Logout ====================
export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("email");
  } catch (err) {
    console.error("Logout error:", err.message);
    throw err;
  }
};

// ==================== Get Current User ====================
export const getCurrentUser = () => {
  return auth.currentUser;
};