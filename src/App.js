import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import { DASHBOARD_BASE } from "./config";
import { NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";

function App() {
  const gradient = "bg-gradient-to-br from-white via-stone-50 to-stone-200";

  return (
    <>
      <nav className="w-screen flex justify-between fixed top-0 bg-white">
        <base href={"/"}></base>
        <NavLink className="px-5 py-3 tracking-wide font-light" to="/">
          Open Game Data
        </NavLink>
      </nav>
      <div className={`App h-screen w-screen py-12 ${gradient}`}>
        <Routes>
          <Route path={DASHBOARD_BASE + "/"} element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
