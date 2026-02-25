import { useEffect, useState } from "react";

/**
 * @desc Custom hook to animate numeric values from 0 to a target number
 * @param {number} end - The target number to reach
 * @param {number} duration - Total time for the animation in milliseconds
 * @returns {number} The current animated count value
 */
const useCountUp = (end, duration = 1000) => {
  // Ensuring the end value is a valid number to prevent calculation errors
  const safeEnd = Number(end) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    // Calculating increment based on 60fps (approx 16ms per frame)
    const increment = safeEnd / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      // Checking if the target value is reached
      if (start >= safeEnd) {
        setCount(safeEnd);
        clearInterval(timer);
      } else {
        // Updating count with the rounded floor value
        setCount(Math.floor(start));
      }
    }, 16);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(timer);
  }, [safeEnd, duration]);

  return count;
};

export default useCountUp;