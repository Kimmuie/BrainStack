import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { fetchAPI } from "../service/fetchapi";

const SignIn = ({ setUser }) => {
    const handleClick = async () => {

        try {
        const data = await signInWithPopup(auth, provider);
        const email = data.user.email;
        const username = data.user.displayName;

        const existingUser = await fetchAPI(`/users/${email}`, "GET");
        
        if(existingUser) {
            localStorage.setItem("email", email);
            setUser(email);
        } else{
            const newUser = await fetchAPI('/users', "POST", { email, username, theme: "dark" });
            if (newUser) {
                localStorage.setItem('email', email);
                console.log("Log In Success");
            }
        }
        
        console.log("Log In Success");
        } catch (err) {
        console.error("Login error:", err.message);
        }
    };

    return (
        <button 
            onClick={handleClick} 
            className="flex flex-row items-center gap-2 text-Primary bg-ellWhite border-2 hover:bg-Primary hover:text-Secondary border-Primary rounded-full px-4 py-2 text-lg font-semibold cursor-pointer">
            <img src="./img/icon_google.svg" width="30" height="30" alt="google" />
            Sign in with Google
        </button>
    );
};

export default SignIn;
