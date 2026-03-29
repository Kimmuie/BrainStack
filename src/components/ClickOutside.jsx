import { useEffect, useRef } from "react";

const ClickOutside = ({ children, onOutsideClick, ignoreRefs = [], className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !ignoreRefs.some(r => r.current?.contains(event.target))
      ) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onOutsideClick, ignoreRefs]);

  return <div ref={ref} className={className}>{children}</div>;
};

export default ClickOutside;