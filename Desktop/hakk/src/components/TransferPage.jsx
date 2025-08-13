import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";                       // ✅ 공용 헤더
import "../styles/TransferPage.css";                 // ✅ 양도 전용 CSS
import search from "../image/search.png";
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import chatbotImg from "../image/image32.png";
import roomImg from "../image/room-sample.png";

// ✅ 더미 데이터(필요 시 API로 교체)
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

  // 푸터 보정(절대배치 레이아웃)
  const baseFooterTop = 1667;   // 메인과 동일 기준
  const rowHeight = 370;        // 카드(302) + 텍스트/갭 대략치
  const rows = Math.ceil(visible / 3);
  const extraRows = Math.max(0, rows - 2);
  const footerTop = baseFooterTop + extraRows * rowHeight;

  return (
    <div className="screen">
      <div className="container transfer-page">{/* ✅ 페이지 스코프 */}
        {/* 우측 상단 검색 아이콘 (메인과 동일 위치) */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        {/* ✅ 공용 헤더 */}
        <Header />

        {/* 카테고리 3개 (양도 활성) */}
        <div className="category-wrapper">
          <div className="category-card" onClick={() => navigate("/lodging")}>
            <img src={lodgingImg} alt="숙박" className="category-image" />
            <div className="category-label">숙박</div>
          </div>
          <div className="category-card active" onClick={() => navigate("/transfer")}>
            <img src={transferImg} alt="양도" className="category-image" />
            <div className="category-label">양도</div>
          </div>
          <div className="category-card" onClick={() => navigate("/chatbot")}>
            <img src={chatbotImg} alt="AI 챗봇" className="category-image" />
            <div className="category-label">글쓰기</div>
          </div>
        </div>

        {/* 필터 + More */}
        <button
          type="button"
          className={`more-btn ${canLoadMore ? "" : "disabled"}`}
          onClick={handleMore}
          disabled={!canLoadMore}
        >
          More +
        </button>

        {/* 리스트 */}
        <div className="transfer-list">
          {visibleList.map((text, i) => (
            <div className="transfer-card" key={i}>
              <img src={roomImg} alt="양도" className="transfer-image" />
              <div className="transfer-text">{text}</div>
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

export default TransferPage;
