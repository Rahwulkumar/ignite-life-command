import { useEffect, useState } from "react";

const STORAGE_KEY = "investment-values-hidden";

export function useSensitiveValueVisibility() {
  const [isHidden, setIsHidden] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(STORAGE_KEY) === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, String(isHidden));
  }, [isHidden]);

  return {
    isHidden,
    setIsHidden,
    toggle: () => setIsHidden((current) => !current),
  };
}

