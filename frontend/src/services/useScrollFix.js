import { useEffect } from "react";

export const useScrollFix = () => {
  useEffect(() => {
    document.body.classList.remove("showing-meeting");
    document.body.style.overflow = "auto";
    const zoomRoot = document.getElementById("zmmtg-root");
    if (zoomRoot) zoomRoot.style.display = "none";
    window.scrollTo(0, 0);
  }, []);
};