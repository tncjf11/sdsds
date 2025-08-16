import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/TransferPage.css";
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import chatbotImg from "../image/image32.png";
import roomImg from "../image/room-sample.png";

// ✅ 더미 데이터(필요 시 API로 교체)
const TRANSFER_LIST = [
  "대곡빌라 / 150만원 / 바로입주",
  "강남오피스텔 / 90만원 / 2월입주",
  "판교원룸 / 85만원 / 3월입주",
  "신림빌라 / 70만원 / 즉시입주",
  "광교타워 / 110만원 / 협의",
  "잠실오피스텔 / 95만원 / 2월입주",
  "마포원룸 / 82만원 / 3월입주",
  "용산빌라 / 120만원 / 협의",
  "연남동투룸 / 140만원 / 즉시입주",
  "서초오피스텔 / 100만원 / 2월입주",
];

const TransferPage = () => {
  const navigate = useNavigate();

  // ====== 🔎 메인페이지와 동일한 검색 상태/로직 ======
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

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!searchOpen) return;
      const form = document.getElementById("transferpage-top-search-form");
      if (!form?.contains(e.target) && !searchBtnRef.current?.contains(e.target)) {
        setSearchOpen(false);
        searchBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [searchOpen]);

  // ===== More+ 로직 =====
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const visibleList = useMemo(() => TRANSFER_LIST.slice(0, visible), [visible]);
  const canLoadMore = visible < TRANSFER_LIST.length;
  const handleMore = () => setVisible(v => Math.min(v + PAGE_SIZE, TRANSFER_LIST.length));

  // ===== 푸터 자동 위치 보정 =====
  const listRef = useRef(null);
  const [footerTop, setFooterTop] = useState(1667);

  useEffect(() => {
    const calcFooter = () => {
      const el = listRef.current;
      if (!el) return;
      const top = el.offsetTop || 0;
      const height = el.offsetHeight || 0;
      const margin = 60;
      setFooterTop(top + height + margin);
    };
    calcFooter();
    const imgs = listRef.current?.querySelectorAll("img") || [];
    imgs.forEach(img => { if (!img.complete) img.addEventListener("load", calcFooter, { once: true }); });
    window.addEventListener("resize", calcFooter);
    const id = setTimeout(calcFooter, 0);
    return () => { window.removeEventListener("resize", calcFooter); clearTimeout(id); };
  }, [visibleList.length]);

      // ✅ 상세로 이동 (state로 이미지/요약 전달)
  const goDetail = (summary) => {
    navigate("/detailtransfer", {
      state: { img: roomImg, summary },
    });
  };

  return (
    <div className="screen">
      <div className="container transfer-page">
        {/* 🔎 우측 상단 검색(메인과 동일) */}
        <div className="top-search">
          <button
            ref={searchBtnRef}
            className="top-search__toggle"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-controls="transferpage-top-search-form"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="top-search__label">검색</span>
          </button>

          <form
            id="transferpage-top-search-form"
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
          <div className="category-card" onClick={() => navigate("/upload")}>
            <img src={chatbotImg} alt="업로드" className="category-image" />
            <div className="category-label">업로드</div>
          </div>
        </div>

        {/* More 버튼 */}
        <button
          type="button"
          className={`more-btn ${canLoadMore ? "" : "disabled"}`}
          onClick={handleMore}
          disabled={!canLoadMore}
        >
          More +
        </button>

        <div className="transfer-list" ref={listRef}>
          {visibleList.map((text, i) => (
          <div
            className="transfer-card"
            key={i}
            onClick={() => goDetail(text)} // ✅ 상세 페이지 이동
          >
        <img src={roomImg} alt="양도" className="transfer-image" />
          <div className="transfer-text">{text}</div>
        </div>
        ))}
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

export default TransferPage;