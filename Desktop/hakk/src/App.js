import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/mainpage";
import LodgingPage from "./components/LodgingPage";
import SearchPage from "./components/SearchPage";
import TransferPage from "./components/TransferPage"; 
import UploadPage from "./components/UploadPage";
import DetailLodging from "./components/Detail_Lodging";
import DetailTransfer from "./components/Detail_Transfer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/lodging" element={<LodgingPage />} />
        <Route path="/transfer" element={<TransferPage />} /> 
        <Route path="/search" element={<SearchPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/detaillodging" element={<DetailLodging />} />
        <Route path="/detailtransfer" element={<DetailTransfer />} />

      </Routes>
    </Router>
  );
}

export default App;