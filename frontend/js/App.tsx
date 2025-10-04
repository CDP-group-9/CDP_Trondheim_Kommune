import * as Sentry from "@sentry/react";
import { parse } from "cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { OpenAPI } from "./api";
import { AppSidebar } from "./components/ui/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { Checklist, Examples, History, Home, Privacy } from "./routes";
import "../css/globals.css";
import Footer from "./components/ui/footer";

OpenAPI.interceptors.request.use((request) => {
  const { csrftoken } = parse(document.cookie);
  if (request.headers && csrftoken) {
    request.headers["X-CSRFTOKEN"] = csrftoken;
  }
  return request;
});

const App = () => (
  <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex flex-col flex-grow w-full">
            <main className="flex-1">
              <Routes>
                <Route element={<Home />} path="/" />
                <Route element={<Privacy />} path="/privacy" />
                <Route element={<Checklist />} path="/checklist" />
                <Route element={<Examples />} path="/examples" />
                <Route element={<History />} path="/history" />
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
