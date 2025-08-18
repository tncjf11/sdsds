import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/LodgingPage.css";
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import chatbotImg from "../image/image32.png";
import roomImg from "../image/room-sample.png";

// 예시 데이터
const LODGINGS = [
  { id: 1, name: "ㅇㅇ빌라", from: "2024-11-02", to: "2024-11-05", price: 30000 },
  { id: 2, name: "ㅇㅇ빌라", from: "2024-11-02", to: "2024-11-05", price: 30000 },
  { id: 3, name: "ㅇㅇ빌라", from: "2024-11-02", to: "2024-11-05", price: 30000 },
  { id: 4, name: "ㅇㅇ빌라", from: "2024-11-02", to: "2024-11-05", price: 30000 },
  { id: 5, name: "ㅇㅇ빌라", from: "2024-11-02", to: "2024-11-05", price: 30000 },
  { id: 6, name: "ㅇㅇ빌라", from: "2024-11-02", to: "2024-11-06", price: 20000 },
  { id: 7, name: "ㅇㅇ빌라", from: "2024-11-03", to: "2024-11-06", price: 28000 },
  { id: 8, name: "ㅇㅇ빌라", from: "2024-11-04", to: "2024-11-07", price: 26000 },
  { id: 9, name: "ㅇㅇ빌라", from: "2024-11-05", to: "2024-11-08", price: 24000 },
];

// 날짜 범위 겹침 체크
const overlap = (aStart, aEnd, bStart, bEnd) =>
  new Date(aStart) <= new Date(bEnd) && new Date(bStart) <= new Date(aEnd);

const LodgingPage = () => {
  const navigate = useNavigate();

  /* ── 🔎 메인페이지와 동일한 검색 토글/폼 상태 ── */
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const searchBtnRef = useRef(null);

  const toggleSearch = () => {
    setSearchOpen((v) => {
      const next = !v;
      setTimeout(() => next && inputRef.current?.focus(), 0);
      return next;
    });
  };
  const submitSearch = () => {
    const q = query.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };
  // 바깥 클릭 시 닫기 + 버튼 포커스 복귀
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!searchOpen) return;
      const form = document.getElementById("lodgingpage-top-search-form");
      if (!form?.contains(e.target) && !searchBtnRef.current?.contains(e.target)) {
        setSearchOpen(false);
        searchBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [searchOpen]);

  // ====== 필터 상태 ======
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const clearFilters = () => { setQ(""); setFrom(""); setTo(""); setMinPrice(""); setMaxPrice(""); };

  // 검색어 디바운스
  const [debouncedQ, setDebouncedQ] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  // ====== 목록 필터링 ======
  const filtered = useMemo(() => {
    return LODGINGS.filter((s) => {
      const okName =
        debouncedQ.trim() === "" ||
        s.name.toLowerCase().includes(debouncedQ.trim().toLowerCase());

      const okMin = minPrice === "" || s.price >= Number(minPrice);
      const okMax = maxPrice === "" || s.price <= Number(maxPrice);

      let okDate = true;
      if (from && to) okDate = overlap(from, to, s.from, s.to);
      else if (from)  okDate = new Date(from) <= new Date(s.to);
      else if (to)    okDate = new Date(s.from) <= new Date(to);

      return okName && okMin && okMax && okDate;
    });
  }, [debouncedQ, from, to, minPrice, maxPrice]);

  // ====== More+ 페이지네이션 ======
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => setVisible(PAGE_SIZE), [debouncedQ, from, to, minPrice, maxPrice]);

  const visibleList = useMemo(() => filtered.slice(0, visible), [filtered, visible]);
  const canLoadMore = visible < filtered.length;
  const handleMore = () => setVisible(v => Math.min(v + PAGE_SIZE, filtered.length));

  // ====== 리스트 실제 높이에 맞춰 푸터 위치 조정 ======
  const listRef = useRef(null);
  const [footerTop, setFooterTop] = useState(1667);
  useEffect(() => {
    const calc = () => {
      const el = listRef.current;
      if (!el) return;
      const top = el.offsetTop || 0;
      const height = el.offsetHeight || 0;
      const margin = 60;
      setFooterTop(top + height + margin);
    };
    calc();
    const imgs = listRef.current?.querySelectorAll("img") || [];
    imgs.forEach(img => { if (!img.complete) img.addEventListener("load", calc, { once: true }); });
    window.addEventListener("resize", calc);
    const id = setTimeout(calc, 0);
    return () => { window.removeEventListener("resize", calc); clearTimeout(id); };
  }, [visibleList.length]);

    // ✅ 상세로 이동 (state로 이미지/요약 전달)
  const goDetail = (summary) => {
    navigate("/detaillodging", {
      state: { img: roomImg, summary },
    });
  };

  return (
    <div className="screen">
      <div className="container lodging-page">
        {/* 🔎 우측 상단 검색(메인과 동일) */}
        <div className="top-search">
          <button
            ref={searchBtnRef}
            className="top-search__toggle"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-controls="lodgingpage-top-search-form"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="top-search__label">검색</span>
          </button>

          <form
            id="lodgingpage-top-search-form"
            role="search"
            className={`top-search__form ${searchOpen ? "is-open" : ""}`}
            aria-hidden={!searchOpen}
            onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
          >
            <input
              ref={inputRef}
              className="top-search__input"
              placeholder="원룸/건물명 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="검색어 입력"
              tabIndex={searchOpen ? 0 : -1}
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
            />
          </form>
        </div>

        {/* 공용 헤더 */}
        <Header />

        {/* 카테고리 3개 (숙박 활성) */}
        <div className="category-wrapper">
          <div className="category-card active" onClick={() => navigate("/lodging")}>
            <img src={lodgingImg} alt="숙박" className="category-image" />
            <div className="category-label">숙박</div>
          </div>
          <div className="category-card" onClick={() => navigate("/transfer")}>
            <img src={transferImg} alt="양도" className="category-image" />
            <div className="category-label">양도</div>
          </div>
          <div className="category-card" onClick={() => navigate("/upload")}>
            <img src={chatbotImg} alt="업로드" className="category-image" />
            <div className="category-label">업로드</div>
          </div>
        </div>

        {/* ===== 필터 바 + More ===== */}
        <div className="filter-bar">
          {/* (이하 원본 그대로) */}
          <div className="chip input-chip">
            <span className="chip-label">건물명</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예: ○○빌라"
            />
          </div>
          <div className="chip date-chip">
            <span className="chip-label">날짜</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span className="tilde">~</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="chip input-chip">
            <span className="chip-label">금액</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="최소"
            />
            <span className="tilde">~</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="최대"
            />
            <span className="won">원</span>
          </div>

          <button type="button" className="chip clear-chip" onClick={clearFilters}>
            초기화
          </button>
        </div>

        <button
          type="button"
          className={`more-btn ${canLoadMore ? "" : "disabled"}`}
          onClick={handleMore}
          disabled={!canLoadMore}
        >
          More +
        </button>

        {/* ===== 숙박 리스트 ===== */}
        <div className="lodging-list" ref={listRef}>
          {visibleList.map((s) => (
            <div className="lodging-card"
              key={s.id}
              onClick={() =>
              goDetail(
                `${s.name} / ${s.from.slice(5).replace("-", ".")}~${s.to.slice(5)
                .replace("-", ".")} / ${s.price.toLocaleString()}원`
              )
            }
            >
            <img src={roomImg} alt="숙박" className="lodging-image" />
              <div className="lodging-text">
            {`${s.name} / ${s.from.slice(5).replace("-", ".")}~${s.to.slice(5)
            .replace("-", ".")} / ${s.price.toLocaleString()}원`}
          </div>
        </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty">조건에 맞는 숙소가 없어요.</div>
          )}
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

export default LodgingPage;