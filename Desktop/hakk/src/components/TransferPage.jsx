import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TransferPage.css";               // ✨ 전용 CSS
import house from "../image/house.png";
import search from "../image/search.png";
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import chatbotImg from "../image/image32.png";
import roomImg from "../image/room-sample.png";

// 더미 데이터 (원하면 API로 대체)
const TRANSFER_LIST = [
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
];

const TransferPage = () => {
  const navigate = useNavigate();

  // More+ 로직
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const visibleList = useMemo(() => TRANSFER_LIST.slice(0, visible), [visible]);
  const canLoadMore = visible < TRANSFER_LIST.length;
  const handleMore = () => setVisible(v => Math.min(v + PAGE_SIZE, TRANSFER_LIST.length));

  // 푸터 보정(절대배치 환경)
  const baseFooterTop = 1667;
  const rowHeight = 370;
  const rows = Math.ceil(visible / 3);
  const extraRows = Math.max(0, rows - 2);
  const footerTop = baseFooterTop + extraRows * rowHeight;

  return (
    <div className="screen transfer-page">{/* ✨ 스코프 클래스 */}
      <div className="container">
        {/* 검색 버튼 */}
        <div
          className="search-button"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/search")}
        >
          <div className="search-label">Let’s search!</div>
        </div>
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        {/* 헤더 */}
        <div className="header">
          <h1 className="main-title">
            FIT ROOM<br />_Finding a house that suits me
          </h1>
          <img src={house} alt="house" className="house-image" />
        </div>

        {/* 카테고리 버튼 */}
        <div className="category-wrapper">
          <div className="category-card" onClick={() => navigate("/lodging")}>
            <img src={lodgingImg} alt="숙박" className="category-image" />
            <div className="category-label">숙박</div>
          </div>

          {/* ✨ 양도만 활성화 색상 */}
          <div className="category-card active" onClick={() => navigate("/transfer")}>
            <img src={transferImg} alt="양도" className="category-image" />
            <div className="category-label">양도</div>
          </div>

          <div className="category-card" onClick={() => navigate("/chatbot")}>
            <img src={chatbotImg} alt="AI 챗봇" className="category-image" />
            <div className="category-label">AI 챗봇</div>
          </div>
        </div>

        {/* 필터 */}
        <div className="filter-buttons">
          <button>건물명</button>
          <button>날짜</button>
          <button>금액</button>
        </div>

        {/* More+ */}
        <button
          type="button"
          className={`more-btn ${canLoadMore ? "" : "disabled"}`}
          onClick={handleMore}
          disabled={!canLoadMore}
        >
          More +
        </button>

        {/* 리스트 */}
        <div className="listing-grid">
          {visibleList.map((text, i) => (
            <div className="listing-card" key={i}>
              <img src={roomImg} alt="양도" className="listing-image" />
              <div className="listing-text">{text}</div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <div className="footer-text" style={{ top: `${footerTop}px` }}>
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
