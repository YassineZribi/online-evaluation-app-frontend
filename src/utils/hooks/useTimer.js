import { useState, useEffect } from "react";

export default function useTimer(startDate, endDate) {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [diffInSeconds, setDiffInSeconds] = useState(() => {
        const diff = (new Date(endDate) - new Date(startDate)) / 1000
        if (diff > 0)
            return diff
        else
            return 0
    });
    useEffect(() => {
        const timer = setInterval(() => {
            setDiffInSeconds((prev) => {
                if (prev > 0)
                    return prev - 1
                else
                    clearInterval(timer)
                    return 0
            });
          }, 1000);
      
          // Clean up the timer when the component is unmounted
          return () => clearInterval(timer);
    }, []); // Empty array ensures that effect is only run on mount

    let hours = Math.floor(diffInSeconds / 3600)
    let minutes = Math.floor((diffInSeconds % 3600) / 60)
    let seconds = Math.floor(diffInSeconds % 60)

    // If you want strings with leading zeroes:
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    return {
        hours,
        minutes,
        seconds,
        timerEnd: diffInSeconds <= 0
    };
}