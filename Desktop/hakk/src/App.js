import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/mainpage";
import LodgingPage from "./components/LodgingPage";
import SearchPage from "./components/SearchPage";
import TransferPage from "./components/TransferPage"; // ★ 추가

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/lodging" element={<LodgingPage />} />
        <Route path="/transfer" element={<TransferPage />} /> {/* ★ 추가 */}
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
