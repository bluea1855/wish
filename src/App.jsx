import React from "react";
import { Routes, Route } from "react-router-dom";
import './index.css';
import Home from "./pages/Home";
// import Gift from "./pages/Gift";
import FeatureContent from "./pages/FeatureContent";
import Gift from "./Pages/Gift";
import DynamicRedirect from './pages/[id]';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Gift />} />
      <Route path="/wish" element={<Home />} />
      <Route path="/gift" element={<FeatureContent />} />
      <Route path="/:id" element={<DynamicRedirect />} />
      <Analytics/>
      <SpeedInsights/>
    </Routes>
  );
}

export default App;
