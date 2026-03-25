import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import { useState } from 'react'
import NotFound from "./pages/Error";
import MainPage from "./pages/MainPage";

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router> 
    </>
  )
}

export default App
