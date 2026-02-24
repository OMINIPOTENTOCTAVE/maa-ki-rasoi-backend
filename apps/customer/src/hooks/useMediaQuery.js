import { useState, useEffect } from 'react';

/**
 * Custom hook to detect responsive breakpoints.
 * @returns {{ isMobile: boolean, isTablet: boolean, isDesktop: boolean, isWide: boolean }}
 */
export default function useMediaQuery() {
    const getBreakpoint = () => {
        const w = window.innerWidth;
        return {
            isMobile: w <= 768,
            isTablet: w >= 769 && w <= 1024,
            isDesktop: w >= 1025,
            isWide: w >= 1280,
        };
    };

    const [bp, setBp] = useState(getBreakpoint);

    useEffect(() => {
        let rafId;
        const handler = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => setBp(getBreakpoint()));
        };
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('resize', handler);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return bp;
}
