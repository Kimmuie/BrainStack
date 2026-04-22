import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import { useState } from 'react'
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from './components/Navbar';
import NotFound from "./pages/Error";
import MainPage from "./pages/MainPage";
import GroupPage from "./pages/GroupPage";
import License from "./components/License";
import IdeaPage from "./pages/IdeaPage";

function App() {

  return (
    <>
    <ThemeProvider>
      <Router>
        <Navbar />
        <div className="h-20" />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/group/:groupPath" element={<GroupPage />} />
          <Route path="/group/:groupPath/:caseCode" element={<IdeaPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <License />
      </Router> 
    </ThemeProvider>
    </>
  )
}

export default App
