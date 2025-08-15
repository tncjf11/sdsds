import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import house from "../image/house.png";
import search from "../image/search.png";
import "../styles/SearchPage.css";

// 데모용 고정 리스트
const RESULTS = [
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
];

export default function SearchPage() {
  const navigate = useNavigate();

  // ✅ URL에서 q 읽어서 초기값 세팅
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [placeholder, setPlaceholder] = useState(
    initialQ ? "" : "검색어를 입력하세요"
  );

  // 뒤로가기/앞으로가기 등으로 q가 바뀌면 input도 동기화
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    setPlaceholder(q ? "" : "검색어를 입력하세요");
  }, [searchParams]);

  // 결과 필터링
  const filtered = useMemo(
    () => RESULTS.filter((r) => r.includes(query)),
    [query]
  );

  // 제출 시 URL도 q로 동기화 (새로고침/공유에 유리)
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    setSearchParams(q ? { q } : {}); // q 없으면 깔끔히 제거
  };

  return (
    <div className="screen search-page">
      <div className="container">
        {/* 상단 영역 */}
        <div className="header">
          <div className="branding">
            <p className="branding-text">
              FIT ROOM<br />_Finding<br />a house that suits me
            </p>

            {/* 집 아이콘 클릭 → 메인으로 */}
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

          {/* 우측 상단: 버튼만 (돋보기 제거) */}
          <div className="controls">
            <button className="search-top-btn" onClick={() => navigate("/")}>
              Let’s search!
            </button>
          </div>

          {/* 가운데 검색바 */}
          <form className="search-bar" onSubmit={handleSubmit}>
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

        {/* 라벨 (칩 1개로 통일) */}
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
