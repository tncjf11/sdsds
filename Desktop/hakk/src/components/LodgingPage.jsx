import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LodgingPage.css";
import house from "../image/house.png";
import search from "../image/search.png";
import lodgingImg from "../image/image19.png"; // 숙박 아이콘
import transferImg from "../image/image21.png"; // 양도 아이콘
import chatbotImg from "../image/image32.png"; // AI 챗봇 아이콘
import roomImg from "../image/room-sample.png"; // 숙박 사진 샘플

// ✅ lodgingList를 컴포넌트 밖으로 이동
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
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);

  // ✅ lodgingList 대신 LODGING_LIST 사용
  const visibleList = useMemo(
    () => LODGING_LIST.slice(0, visible),
    [visible]
  );

  const canLoadMore = visible < LODGING_LIST.length;

  return (
    <div className="screen">
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

        {/* 필터 버튼 */}
        <div className="filter-buttons">
          <button>건물명</button>
          <button>날짜</button>
          <button>금액</button>
        </div>

        {/* 숙박 리스트 */}
        <div className="lodging-list">
          {visibleList.map((text, i) => (
            <div className="lodging-card" key={i}>
              <img src={roomImg} alt="숙박" className="lodging-image" />
              <div className="lodging-text">{text}</div>
            </div>
          ))}
        </div>

        {/* More 버튼 */}
        {canLoadMore && (
          <div className="more-btn" onClick={() => setVisible(v => v + PAGE_SIZE)}>
            More +
          </div>
        )}

        {/* 푸터 */}
        <div className="footer-text">
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default LodgingPage;
