import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";                     // ✅ 공용 헤더
import "../styles/LodgingPage.css";                // ✅ 숙박 전용 CSS
import search from "../image/search.png";
import lodgingImg from "../image/image19.png";     // 숙박 아이콘
import transferImg from "../image/image21.png";    // 양도 아이콘
import chatbotImg from "../image/image32.png";     // AI 챗봇 아이콘
import roomImg from "../image/room-sample.png";    // 숙박 사진 샘플

// ✅ ESLint 경고 방지: 고정 리스트는 컴포넌트 밖에
const LODGING_LIST = [
  "ㅇㅇ빌라 / 11.2~11.5 / 30000w",
  "ㅇㅇ빌라 / 11.2~11.5 / 30000w",
  "ㅇㅇ빌라 / 11.2~11.5 / 30000w",
  "ㅇㅇ빌라 / 11.2~11.5 / 30000w",
  "ㅇㅇ빌라 / 11.2~11.5 / 30000w",
  "ㅇㅇ빌라 / 11.2~11.6 / 20000w",
  "ㅇㅇ빌라 / 11.3~11.6 / 28000w",
  "ㅇㅇ빌라 / 11.4~11.7 / 26000w",
  "ㅇㅇ빌라 / 11.5~11.8 / 24000w",
];

const LodgingPage = () => {
  const navigate = useNavigate();

  // More+ 로직
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const visibleList = useMemo(() => LODGING_LIST.slice(0, visible), [visible]);
  const canLoadMore = visible < LODGING_LIST.length;
  const handleMore = () => setVisible(v => Math.min(v + PAGE_SIZE, LODGING_LIST.length));

  // 푸터 보정(절대배치 레이아웃)
  const baseFooterTop = 1667;   // 메인과 동일 기준
  const rowHeight = 370;        // 카드(302) + 텍스트/갭 대략치
  const rows = Math.ceil(visible / 3);
  const extraRows = Math.max(0, rows - 2);
  const footerTop = baseFooterTop + extraRows * rowHeight;

  return (
    <div className="screen">
      <div className="container lodging-page">{/* ✅ 페이지 스코프 클래스 */} 
        {/* 우측 상단 검색 아이콘 (메인과 동일 위치) */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        {/* ✅ 공용 헤더 (메인과 완전 동일 레이아웃) */}
        <Header />

        {/* 카테고리 3개 (메인과 동일 위치/크기, 숙박 활성) */}
        <div className="category-wrapper">
          <div className="category-card active" onClick={() => navigate("/lodging")}>
            <img src={lodgingImg} alt="숙박" className="category-image" />
            <div className="category-label">숙박</div>
          </div>
          <div className="category-card" onClick={() => navigate("/transfer")}>
            <img src={transferImg} alt="양도" className="category-image" />
            <div className="category-label">양도</div>
          </div>
          <div className="category-card" onClick={() => navigate("/chatbot")}>
            <img src={chatbotImg} alt="AI 챗봇" className="category-image" />
            <div className="category-label">AI 챗봇</div>
          </div>
        </div>

        {/* 필터 + More */}
        <div className="filter-buttons">
          <button>건물명</button>
          <button>날짜</button>
          <button>금액</button>
        </div>
        <button
          type="button"
          className={`more-btn ${canLoadMore ? "" : "disabled"}`}
          onClick={handleMore}
          disabled={!canLoadMore}
        >
          More +
        </button>

        {/* 숙박 리스트 */}
        <div className="lodging-list">
          {visibleList.map((text, i) => (
            <div className="lodging-card" key={i}>
              <img src={roomImg} alt="숙박" className="lodging-image" />
              <div className="lodging-text">{text}</div>
            </div>
          ))}
        </div>

        {/* 푸터 (행 수에 따라 자동 보정) */}
        <div className="footer-text" style={{ top: `${footerTop}px` }}>
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default LodgingPage;
