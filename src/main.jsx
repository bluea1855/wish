import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import './index.css';
import { Analytics } from "@vercel/analytics";
import { SpeedInsights } from "@vercel/speed-insights";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Analytics />
      <SpeedInsights />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
