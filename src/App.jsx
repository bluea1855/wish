import React from "react";
import { Routes, Route } from "react-router-dom";
import './index.css';
import Home from "./pages/Home";
import FeatureContent from "./pages/FeatureContent";
import Gift from "./pages/Gift";
import DynamicRedirect from './pages/[id]';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Gift />} />
      <Route path="/wish" element={<Home />} />
      <Route path="/gift" element={<FeatureContent />} />
      <Route path="/:id" element={<DynamicRedirect />} />
    </Routes>
    </>
  );
}

export default App;
