import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Alert from "./Alert";

const SignOut = ({ setUser }) => {
  const [showAlert, setShowAlert] = useState(false);

  const handleSignout = () => {
    setShowAlert(true);
  };
  
  const confirmSignout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("email");
        setUser(null);
        console.log("Log Out Success");
        setShowAlert(false);
      })
      .catch((error) => console.error("Logout Failed", error));
  };

  return (
    <>
    <button
      onClick={handleSignout}
      className="flex flex-row items-center justify-center gap-2 text-custom-red bg-ellWhite border-2 hover:bg-custom-red  hover:text-Primary border-custom-red rounded-full py-2 text-lg font-semibold cursor-pointer">
      Sign Out
    </button>
      {showAlert && (
        <Alert
        onConfirm={confirmSignout} 
        onCancel={() => setShowAlert(false)} 
        Header="You're about to sign out"
        Description="You can return anytime, by the way your data will remain unchanged."
        />
      )}
    </>
  );
};

export default SignOut;
