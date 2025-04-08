import {useEffect, useRef} from "react";

const useIdleTimeout = (logout, timeout = 8 * 60 * 60 * 1000) => {
    const timer = useRef(null);

    useEffect(() => {
        const resetTimer = () => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                logout();
            }, timeout);
        };

        const events = ["mousemove", "keydown", "scroll", "click"];
        events.forEach((event) => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            clearTimeout(timer.current);
            events.forEach((event) => window.removeEventListener(event, resetTimer));
        };
    }, [logout, timeout]);
};

export default useIdleTimeout;
