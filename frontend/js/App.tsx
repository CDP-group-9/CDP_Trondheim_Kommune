import * as Sentry from "@sentry/react";
import { parse } from "cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { OpenAPI } from "./api";
import { AppSidebar } from "./components/ui/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { Checklist, Examples, History, Home, Privacy } from "./routes";
import "../css/globals.css";
import trondheimLogo from "../assets/images/tk-logo-co.png";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <header className="bg-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 ml-auto">
        <a
          href="https://www.trondheim.kommune.no/"
          target="_blank"
          className="rounded-md cursor-pointer"
          aria-label="Gå til Trondheim Kommune sin hjemmeside (åpner i ny fane)"
        >
          <img
            src={trondheimLogo}
            alt="Trondheim Kommune logo"
            className="h-8 object-contain hover:opacity-80 transition-opacity"
            role="img"
          />
        </a>
      </div>
    </header>
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1">
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Privacy />} path="/privacy" />
              <Route element={<Checklist />} path="/checklist" />
              <Route element={<Examples />} path="/examples" />
              <Route element={<History />} path="/history" />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </BrowserRouter>
  </Sentry.ErrorBoundary>
);

export default App;
