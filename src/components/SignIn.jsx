import React from "react";
// import { auth, provider } from "./firebase";
// import { signInWithPopup } from "firebase/auth";

const SignIn = ({ setUser }) => {

    // Authentication with Google using Firebase - แก้ด้วยเด้อ
    const handleClick = () => {
        signInWithPopup(auth, provider).then((data) => {
        const email = data.user.email;
        localStorage.setItem("email", email);
        setUser(email);
        console.log("Log In Success");
        });
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
