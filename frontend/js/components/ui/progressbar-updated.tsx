import * as React from "react";

import { Progress } from "./progress";

const ProgressBarUpdated = () => {
  const [progress, setProgress] = React.useState(0);

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
      <Progress className="h-2 w-full rounded-none" value={progress} />
    </div>
  );
};

export default ProgressBarUpdated;
