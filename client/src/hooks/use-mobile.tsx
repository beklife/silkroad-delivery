import * as React from "react"

const MOBILE_BREAKPOINT = 768

const isBrowser = typeof window !== 'undefined';

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => {
    if (!isBrowser) return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  React.useEffect(() => {
    if (!isBrowser) return;
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
