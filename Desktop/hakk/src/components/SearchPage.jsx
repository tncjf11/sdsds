import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import house from "../image/house.png";
import search from "../image/search.png";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("검색어를 입력하세요");

  // 데모 데이터(고정)
  const results = useMemo(
    () => [
      "대곡빌라 / 150만원 / 바로입주",
      "대곡빌라 / 150만원 / 바로입주",
      "대곡빌라 / 150만원 / 바로입주",
      "대곡빌라 / 150만원 / 바로입주",
    ],
    []
  );

  const filtered = useMemo(
    () => results.filter((r) => r.includes(query)),
    [results, query]
  );

  return (
    <div className="screen search-page">
      <div className="container">
        {/* 헤더 */}
        <div className="header">
          <div className="branding">
            <p className="branding-text">
              FIT ROOM<br />_Finding<br />a house that suits me
            </p>
            <img className="house-icon" src={house} alt="house" />
          </div>

          {/* 우측 상단 컨트롤 */}
          <div className="controls">
            <button className="search-top-btn" onClick={() => navigate("/")}>
              Let’s search!
            </button>
            <img
              className="sp-search-top-icon"
              src={search}
              alt="home"
              onClick={() => navigate("/")}
            />
          </div>

          {/* 중앙 검색바 (밑줄 포함) */}
          <form
            className="search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              // 실제 검색 호출 위치
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
                setPlaceholder(query.trim() === "" ? "검색어를 입력하세요" : "")
              }
            />
          </form>
        </div>

        {/* 섹션 라벨 */}
        <div className="section-labels">
          <div className="label-black">검색과 일치하는</div>
          <div className="label-black">게시물</div>
        </div>

        {/* 결과 */}
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
