import React from 'react'
import { Routes, Route } from "react-router-dom";
import './App.scss';
// import './assets/scss/styles_ver1.scss';
import { DASHBOARD_BASE } from './config';
import Navigation from './components/navigation/Navigation';
import Dashboard from './view/Dashboard';
import NotFound from "./view/NotFound";

function App() {
  return (
    <>
      <Navigation />
      <div className='App h-screen w-screen pt-12 bg-gradient-to-br from-white via-stone-50 to-stone-200'>
        <Routes>
          <Route path={DASHBOARD_BASE+"/"} element={<Dashboard />} />
          {/* <Route path={base_path+"dashboard"} element={<Dashboard />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
