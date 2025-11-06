import { useState, useEffect, useCallback } from "react";

export function useInternalStatus(): {
  isInternal: boolean | null;
  updateInternalStatus: (value: boolean) => Promise<void>;
} {
  const [isInternal, setIsInternal] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("isInternal");
    if (stored !== null) {
      try {
        setIsInternal(JSON.parse(stored));
      } catch {
        setIsInternal(null);
      }
    }
  }, []);

  const updateInternalStatus = useCallback(async (value: boolean) => {
    setIsInternal(value);
    localStorage.setItem("isInternal", JSON.stringify(value));

    try {
      const res = await fetch("/api/internal-status/set_system_instruction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        // eslint-disable-next-line camelcase
        body: JSON.stringify({ is_internal: value }),
      });

      if (!res.ok) {
        console.error(
          "Failed to update internal status, status:",
          res.status,
          await res.text(),
        );
      }
    } catch (err) {
      console.error("Failed to send internal status:", err);
    }
  }, []);

  return { isInternal, updateInternalStatus };
}
