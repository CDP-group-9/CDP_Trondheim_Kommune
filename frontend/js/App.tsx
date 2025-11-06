import * as Sentry from "@sentry/react";
import { parse } from "cookie";
import { useLayoutEffect, useRef } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { OpenAPI } from "api";
import { DssFooter, DssHeader, DssMain, DssSidebar } from "components/dss";
import { SidebarInset, SidebarProvider } from "components/ui/sidebar";
import { AppStateProvider } from "contexts/AppStateContext";

import { Checklist, Examples, Home, Privacy } from "./routes";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const updateLayoutVars = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const footerHeight = footerRef.current?.offsetHeight ?? 0;

      document.body.style.setProperty("--header-height", `${headerHeight}px`);
      document.body.style.setProperty("--footer-height", `${footerHeight}px`);
    };

    updateLayoutVars();

    let headerObserver: ResizeObserver | undefined;
    let footerObserver: ResizeObserver | undefined;
    let resizeListenerAttached = false;

    if (typeof ResizeObserver !== "undefined") {
      if (headerRef.current) {
        headerObserver = new ResizeObserver(updateLayoutVars);
        headerObserver.observe(headerRef.current);
      }

      if (footerRef.current) {
        footerObserver = new ResizeObserver(updateLayoutVars);
        footerObserver.observe(footerRef.current);
      }
    } else {
      resizeListenerAttached = true;
      window.addEventListener("resize", updateLayoutVars);
    }

    return () => {
      headerObserver?.disconnect();
      footerObserver?.disconnect();

      if (resizeListenerAttached) {
        window.removeEventListener("resize", updateLayoutVars);
      }

      document.body.style.removeProperty("--header-height");
      document.body.style.removeProperty("--footer-height");
    };
  }, []);

  return (
    <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
      <BrowserRouter
        future={{
          // eslint-disable-next-line camelcase
          v7_startTransition: true,
          // eslint-disable-next-line camelcase
          v7_relativeSplatPath: true,
        }}
      >
        <AppStateProvider>
          <SidebarProvider>
            <DssSidebar />
            <DssHeader ref={headerRef} />
            <SidebarInset className="scroll-smooth">
              <DssMain className="flex justify-center min-h-[calc(100vh-var(--header-height)-var(--footer-height))] min-w-200 overflow-x-hidden p-4 pb-[calc(var(--footer-height)+0.1rem)] mx-auto overflow-hidden bg-secondary-background pt-[var(--header-height)]">
                <Routes>
                  <Route element={<Home />} path="/" />
                  <Route element={<Privacy />} path="/personvern" />
                  <Route element={<Checklist />} path="/sjekkliste" />
                  <Route element={<Examples />} path="/eksempel" />
                </Routes>
              </DssMain>
            </SidebarInset>
            <DssFooter ref={footerRef} className="" />
          </SidebarProvider>
        </AppStateProvider>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  );
};

export default App;
