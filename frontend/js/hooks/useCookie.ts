import React from "react";

export function useCookie(name: string) {
  return React.useMemo(() => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(";").shift() || "";
    return "";
  }, [name]);
}
