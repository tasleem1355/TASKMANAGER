import React from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import GoogleProvider from "@/auth/GoogleProvider";

import App from "./App.tsx";

import "./index.css";

createRoot(
  document.getElementById("root")!
).render(

  <React.StrictMode>

    <GoogleProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleProvider>

  </React.StrictMode>
);