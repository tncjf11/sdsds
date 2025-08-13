import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";                      // ✅ 공용 헤더
import "../styles/mainpage.css";
import image19 from "../image/image19.png";
import image21 from "../image/image21.png";
import image32 from "../image/image32.png";
import search from "../image/search.png";

/* =====================[ TopList 탭 데이터 ]===================== */
const TOPLIST_BY_CATEGORY = {
  숙박: [
    "대곡빌라 / 150만원 / 바로입주",
    "대곡빌라 / 150만원 / 바로입주",
    "대곡빌라 / 150만원 / 바로입주",
    "대곡빌라 / 150만원 / 바로입주",
  ],
  양도: [
    "양도 - 대곡빌라 / 140만원 / 협의가능",
    "양도 - 한강뷰오피스텔 / 90만원 / 2월입주",
    "양도 - 신림빌라 / 70만원 / 즉시입주",
    "양도 - 판교원룸 / 85만원 / 3월입주",
  ],
};
/* ============================================================= */

export const CategoryCard = ({ image, label, style, backgroundColor, onClick }) => (
  <div
    className="category-card"
    style={{ ...style, backgroundColor, position: "absolute" }}
    onClick={onClick}
  >
    <img src={image} alt={label} className="category-image" />
    <div className="category-label">{label}</div>
  </div>
);

export const RentalCard = ({ number, label, style }) => (
  <div className="rental-card" style={{ ...style, position: "absolute" }}>
    <div className="rental-bg" />
    <div className="rental-circle" />
    <div className="rental-number">{number}</div>
    <p className="rental-label">{label}</p>
  </div>
);

const Screen = () => {
  const navigate = useNavigate();

  /* 데모용 기본 배열 — 안정화 */
  const rentalLabels = useMemo(
    () => [
      "대곡빌라 / 150만원 / 바로입주",
      "대곡빌라 / 150만원 / 바로입주",
      "대곡빌라 / 150만원 / 바로입주",
      "대곡빌라 / 150만원 / 바로입주",
    ],
    []
  );

  /* 탭 상태 */
  const [selectedTab, setSelectedTab] = useState("숙박");

  const currentRentalLabels = useMemo(() => {
    return TOPLIST_BY_CATEGORY[selectedTab] ?? rentalLabels;
  }, [selectedTab, rentalLabels]);

  return (
    <div className="screen">
      <div className="container">
        {/* 우측 상단 검색 아이콘 */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        {/* ✅ 공용 헤더 */}
        <Header />

        {/* Top List */}
        <div className="top-list-label">Top List</div>

        {/* 숙박 / 양도 탭 */}
        <div className="top-tabs" role="tablist" aria-label="Top List 카테고리">
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "숙박"}
            className={`top-tab ${selectedTab === "숙박" ? "is-active" : ""}`}
            onClick={() => setSelectedTab("숙박")}
          >
            숙박
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === "양도"}
            className={`top-tab ${selectedTab === "양도" ? "is-active" : ""}`}
            onClick={() => setSelectedTab("양도")}
          >
            양도
          </button>
        </div>

        {/* 카테고리 카드 */}
        <CategoryCard
          image={image19}
          label="숙박"
          style={{ left: 87, top: 684 }}
          backgroundColor="#D4E4E1"
          onClick={() => navigate("/lodging")}
        />
        <CategoryCard
          image={image21}
          label="양도"
          style={{ left: 491, top: 684 }}
          backgroundColor="#EFD7E4"
          onClick={() => navigate("/transfer")}
        />
        <CategoryCard
          image={image32}
          label="글쓰기"
          style={{ left: 900, top: 684 }}
          backgroundColor="#F3E1CB"
          onClick={() => navigate("/chatbot")}
        />

        {/* 렌탈 카드 */}
        {currentRentalLabels.map((label, i) => (
          <RentalCard
            key={`${selectedTab}-${i}`}
            number={i + 1}
            label={label}
            style={{ left: 87 + i * 323, top: 1209 }}
          />
        ))}

        {/* 푸터 */}
        <div className="footer-text">
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default Screen;
