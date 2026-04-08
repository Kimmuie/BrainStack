import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import { useState } from 'react'
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from './components/Navbar';
import NotFound from "./pages/Error";
import MainPage from "./pages/MainPage";

function App() {

  return (
    <>
    <ThemeProvider>
      <Router>
        <Navbar />
        <div className="h-20" />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router> 
    </ThemeProvider>
    </>
  )
}

export default App
