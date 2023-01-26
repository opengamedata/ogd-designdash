import React from 'react'
import { Routes, Route } from "react-router-dom";
import './App.scss';
// import './assets/scss/styles_ver1.scss';
import { DASHBOARD_BASE } from './config';
import Navigation from './components/navigation/Navigation';
import Dashboard from './view/Dashboard';
import NotFound from "./view/NotFound";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const gradient = "bg-gradient-to-br from-white via-stone-50 to-stone-200";
    return (
      <>
        <Navigation />
        <div className={`App h-screen w-screen pt-12 ${gradient}`}>
          <Routes>
            <Route path={DASHBOARD_BASE+"/"} element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </>
    );
  }
}

export default App;
