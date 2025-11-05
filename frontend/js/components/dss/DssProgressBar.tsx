import React, { useId, useState } from "react";

import { Progress } from "../ui/progress";

export const DssProgressBar: React.FC = () => {
  const labelId = useId();
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <span className="sr-only" id={labelId}>
        Lesefremdrift for sjekklisten
      </span>
      <Progress
        aria-labelledby={labelId}
        className="h-2 w-full rounded-none"
        value={progress}
      />
    </div>
  );
};
