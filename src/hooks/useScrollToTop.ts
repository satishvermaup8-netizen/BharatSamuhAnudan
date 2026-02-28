import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of page when component mounts
 * Useful for preventing page from staying at previous scroll position
 * when navigating between pages in a SPA
 */
export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}
