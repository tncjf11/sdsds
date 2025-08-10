import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mainpage.css";
import house from "../image/house.png";
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

export const TagGroup = () => (
  <div className="tag-group">
    <div className="tag tag-outline" style={{ transform: "rotate(-6.33deg)" }}>
      short_term
    </div>
    <div className="tag tag-outline-white" style={{ transform: "rotate(2.37deg)" }}>
      to long-term
    </div>
    <div className="tag tag-filled" style={{ transform: "rotate(-5.35deg)" }}>
      rentals!
    </div>
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
        {/* 상단 오른쪽: 돋보기 아이콘 (누르면 /search 이동) */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        {/* 헤더 */}
        <div className="header">
          <h1 className="main-title">
            FIT ROOM<br />_Finding<br />a house that suits me
          </h1>
          <img src={house} alt="house" className="house-image" />
        </div>

        {/* 요약/태그 */}
        <div className="summary-box">
          <div className="summary-check">Check out</div>
          <p className="summary-text">your home at a glance,</p>
        </div>
        <TagGroup />

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
          label="AI 챗봇"
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
