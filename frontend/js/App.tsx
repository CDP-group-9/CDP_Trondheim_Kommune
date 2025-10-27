import * as Sentry from "@sentry/react";
import { parse } from "cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { OpenAPI } from "api";
import { DssDynamicBreadcrumb, DssSidebar, DssFooter } from "components/dss";
import { SidebarProvider } from "components/ui/sidebar";

import { Checklist, Examples, Home, Privacy } from "./routes";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <header className="bg-card px-4 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4 ml-auto">
        <a
          className="font-medium text-gray-900 hover:text-gray-900/75 transition-colors cursor-pointer rounded-md px-1 py-1"
          href="/"
        >
          DASQ
        </a>
      </div>
    </header>
    <BrowserRouter
      future={{
        // eslint-disable-next-line camelcase
        v7_startTransition: true,
        // eslint-disable-next-line camelcase
        v7_relativeSplatPath: true,
      }}
    >
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DssSidebar />
          <div className="flex flex-col flex-grow w-full">
            <div className="pl-6 mb-1">
              <DssDynamicBreadcrumb />
            </div>
            <main className="flex-1">
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Privacy />} path="/personvern" />
                <Route element={<Checklist />} path="/sjekkliste" />
                <Route element={<Examples />} path="/eksempel" />
              </Routes>
            </main>
            <DssFooter />
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  </Sentry.ErrorBoundary>
);

export default App;
