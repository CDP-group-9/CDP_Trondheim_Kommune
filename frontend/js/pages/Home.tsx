import { useState, useEffect } from "react";

import DjangoImgSrc from "../../assets/images/django-logo-negative.png";
import { RestService } from "../api";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";

const Home = () => {
  const [showBugComponent, setShowBugComponent] = useState(false);
  const [restCheck, setRestCheck] =
    useState<Awaited<ReturnType<typeof RestService.restRestCheckRetrieve>>>();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    async function onFetchRestCheck() {
      setRestCheck(await RestService.restRestCheckRetrieve());
    }
    onFetchRestCheck();
  }, []);


  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/counter/increment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: { count?: number; error?: string } = await response.json();
      if (response.ok && data.count !== undefined) {
        setCount(data.count);
      } else {
        console.error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {/* Main content goes here */}
          <h2 className="heading-2">Static assets</h2>
          {<Button onClick={handleClick}>Test!</Button>}
          {count > 0 && <p>Button clicked {count} times</p>}
          <Checkbox />
          <div id="django-background">
            If you are seeing the green Django logo on a white background and
            this text color is #092e20, frontend static files serving is
            working:
          </div>
          <div id="django-logo-wrapper">
            <div>
              Below this text, you should see an img tag with the white Django
              logo on a green background:
            </div>
            <img alt="Django Negative Logo" src={DjangoImgSrc} />
          </div>
          <h2 className="heading-2">Rest API</h2>
          <p className="paragraph">{restCheck?.message}</p>
          <button
            className="btn"
            type="button"
            onClick={() => setShowBugComponent(true)}
          >
            Click to test if Sentry is capturing frontend errors! (Should only
            work in Production)
          </button>
          {/* NOTE: The next line intentionally contains an error for testing frontend errors in Sentry. */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {showBugComponent && (showBugComponent as any).field.notexist}
        </main>
      </SidebarProvider>
    </>
  );
};

export default Home;
