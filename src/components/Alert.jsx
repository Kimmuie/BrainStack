// Alert.jsx
import React, { useEffect, useRef } from "react";
import ClickOutside from "./ClickOutside";

const Alert = ({ onConfirm, onCancel, Header, Description }) => {

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 animate-fadeDown z-90">
      <ClickOutside className="border-1 border-custom-red border-t-8 border-t-ellRed  bg-Tertiary rounded-sm shadow-lg max-w-sm w-full flex flex-col h-fit" onOutsideClick={onCancel}>
        <div className="flex flex-row justify-start items-center h-full mt-3 ml-3">
          <img src="/img/icon_alert_gold.svg" width="40" height="40" alt="alert"/>
          <h3 className="text-lg font-prompt font-semibold text-Secondary/60 ml-4">{Header}</h3>
        </div>
        <span className="text-Secondary/60 mt-3 mx-4 h-full text-md font-prompt font-medium">{Description}</span>
        <div className="flex justify-end gap-2 mt-4  border-t-1 border-t-Secondary/60 p-2">
          <button
            onClick={onCancel}
            className="bg-Secondary/60 text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-custom-red text-Tertiary hover:scale-101 active:scale-98 font-medium py-2 px-4 rounded cursor-pointer"
          >
            Yes
          </button>
        </div>
      </ClickOutside>
    </div>
  );
};

export default Alert;