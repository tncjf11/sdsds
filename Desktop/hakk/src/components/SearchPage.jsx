import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import house from "../image/house.png";
import search from "../image/search.png";
import "../styles/SearchPage.css";

// 고정 리스트(데모)
const RESULTS = [
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => RESULTS.filter((r) => r.includes(query)),
    [query]
  );

  const [placeholder, setPlaceholder] = useState("검색어를 입력하세요");

  return (
    <div className="screen search-page">
      <div className="container">
        {/* 상단 영역 */}
        <div className="header">
          <div className="branding">
            <p className="branding-text">
              FIT ROOM<br />_Finding<br />a house that suits me
            </p>
            <img
              className="house-icon"
              src={house}
              alt="house"
              style={{ cursor: "pointer" }}         
              role="button"                         
              tabIndex={0}                         
              onClick={() => navigate("/")}        
              onKeyDown={(e) => {                    
                if (e.key === "Enter" || e.key === " ") navigate("/");
              }}
            />
          </div>

          {/* 우측 상단 컨트롤: 버튼만 남김 (돋보기 제거) */}
          <div className="controls">
            <button className="search-top-btn" onClick={() => navigate("/")}>
              Let’s search!
            </button>
          </div>

          {/* 가운데 검색바 */}
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: 실제 검색 트리거
            }}
          >
            <img className="sp-search-icon" src={search} alt="" aria-hidden="true" />
            <input
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="검색어 입력"
              onFocus={() => setPlaceholder("")}
              onBlur={() =>
                setPlaceholder((prev) =>
                  query.trim() === "" ? "검색어를 입력하세요" : ""
                )
              }
            />
          </form>
        </div>

        {/* 라벨: 한 개 칩 + 검색바와 여백 충분히 */}
        <div className="section-label">
          <div className="label-chip">검색과 일치하는 게시물</div>
        </div>

        {/* 결과 카드 */}
        <div className="results">
          {filtered.map((text, idx) => (
            <div className="result-card" key={idx}>
              <div className="result-thumbnail" />
              <p className="result-text">{text}</p>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <footer className="footer">
          <p>
            FIT ROOM<br />
            <span className="footer-sub">_Finding a house that suits me</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
