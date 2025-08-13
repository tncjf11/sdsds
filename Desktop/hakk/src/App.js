import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* 파일명 대소문자 주의: 실제 파일명과 일치 */
import MainPage from "./components/mainpage";
import LodgingPage from "./components/LodgingPage";
import TransferPage from "./components/TransferPage";
import SearchPage from "./components/SearchPage";
import UploadPage from "./components/UploadPage";

/* ✅ 상세 페이지 라우트 추가 */
import DetailLodging from "./components/Detail_Lodging";
import DetailTransfer from "./components/Detail_Transfer";

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인/목록 */}
        <Route path="/" element={<MainPage />} />
        <Route path="/lodging" element={<LodgingPage />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/chatbot" element={<UploadPage />} />

        {/* ✅ 상세 (state로 img/summary 전달) */}
        <Route path="/lodging/detail" element={<DetailLodging />} />
        <Route path="/transfer/detail" element={<DetailTransfer />} />

        {/* 선택: 404 시 메인으로 */}
        {/* <Route path="*" element={<MainPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
