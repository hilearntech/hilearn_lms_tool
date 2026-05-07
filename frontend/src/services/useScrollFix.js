import { useEffect } from "react";

export const useScrollFix = () => {
  useEffect(() => {
    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
  }, []);
};