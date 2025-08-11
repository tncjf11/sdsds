import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";                      // ✅ 공용 헤더
import "../styles/mainpage.css";
import image19 from "../image/image19.png";
import image21 from "../image/image21.png";
import image32 from "../image/image32.png";
import search from "../image/search.png";

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

  const rentalLabels = [
    "대곡빌라 / 150만원 / 바로입주",
    "대곡빌라 / 150만원 / 바로입주",
    "대곡빌라 / 150만원 / 바로입주",
    "대곡빌라 / 150만원 / 바로입주",
  ];

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

        {/* ✅ 공용 헤더 적용 (메인과 동일 레이아웃) */}
        <Header />

        {/* Top List */}
        <div className="top-list-label">Top List</div>
        <div className="top-list-section">숙박 / 양도</div>

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
        {rentalLabels.map((label, i) => (
          <RentalCard
            key={i}
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
