import * as Sentry from "@sentry/react";
import { parse } from "cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import trondheimLogo from "../assets/images/tk-logo-co.png";

import { OpenAPI } from "./api";
import { DynamicBreadcrumb } from "./components/tk/app-breadcrumb";
import { AppSidebar } from "./components/tk/app-sidebar";
import Footer from "./components/tk/footer";
import { SidebarProvider } from "./components/ui/sidebar";
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
          aria-label="Gå til Trondheim Kommune sin hjemmeside (åpner i ny fane)"
          className="rounded-md cursor-pointer"
          href="https://www.trondheim.kommune.no/"
          rel="noreferrer"
          target="_blank"
        >
          <img
            alt="Trondheim Kommune logo"
            className="h-8 object-contain hover:opacity-80 transition-opacity"
            src={trondheimLogo}
          />
        </a>
      </div>
    </header>
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex flex-col flex-grow w-full">
            <div className="pl-6 mb-1">
              <DynamicBreadcrumb />
            </div>
            <main className="flex-1">
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Privacy />} path="/personvern" />
                <Route element={<Checklist />} path="/sjekkliste" />
                <Route element={<Examples />} path="/eksempel" />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  </Sentry.ErrorBoundary>
);

export default App;
