import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  // ⬇️ URL ?q= 값을 읽고, 변경되면 입력값도 동기화
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQ);
  const [placeholder, setPlaceholder] = useState(
    urlQ ? "" : "검색어를 입력하세요"
  );

  useEffect(() => {
    // 브라우저 뒤로가기 등으로 URL이 바뀌어도 입력값이 따라오게
    setQuery(urlQ);
    setPlaceholder(urlQ ? "" : "검색어를 입력하세요");
  }, [urlQ]);

  // 입력 변경 시 URL도 함께 갱신(새 히스토리 안 쌓이도록 replace)
  const onChange = (e) => {
    const next = e.target.value;
    setQuery(next);
    if (next.trim()) {
      setSearchParams({ q: next }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // 필요 시 여기서 실제 검색 API 호출 트리거
    // 현재는 화면 표시만 하므로 URL 유지
  };

  const filtered = useMemo(
    () => RESULTS.filter((r) => r.includes(query)),
    [query]
  );

  return (
    <div className="screen search-page">
      <div className="container">
        {/* 상단 영역 */}
        <div className="header">
          <div className="branding">
            <p className="branding-text">
              FIT ROOM
              <br />
              _Finding
              <br />
              a house that suits me
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

          {/* 우측 상단 컨트롤(예: 홈으로) */}
          <div className="controls">
            <button
              className="search-top-btn"
              onClick={() => navigate("/")}
            >
              Let’s search!
            </button>
          </div>

          {/* 가운데 검색바 */}
          <form className="search-bar" onSubmit={onSubmit}>
            <img
              className="sp-search-icon"
              src={search}
              alt=""
              aria-hidden="true"
            />
            <input
              className="search-input"
              value={query}
              onChange={onChange}
              placeholder={placeholder}
              aria-label="검색어 입력"
              onFocus={() => setPlaceholder("")}
              onBlur={() =>
                setPlaceholder((prev) =>
                  (query ?? "").trim() === "" ? "검색어를 입력하세요" : ""
                )
              }
            />
          </form>
        </div>

        {/* 라벨 */}
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
            FIT ROOM
            <br />
            <span className="footer-sub">
              _Finding a house that suits me
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}
