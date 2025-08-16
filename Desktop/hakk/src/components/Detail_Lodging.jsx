import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";            // ✅ 공통 Header 사용
import "../styles/Detail_Lodging.css";

/** 네이버 스크립트 로더 */
function useNaverScript(clientId) {
  const [ready, setReady] = useState(!!window.naver?.maps);

  useEffect(() => {
    if (window.naver?.maps) {
      setReady(true);
      return;
    }
    if (!clientId) {
      console.warn("REACT_APP_NAVER_MAP_ID 가 설정되지 않았습니다.");
      return;
    }
    const el = document.createElement("script");
    el.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    el.async = true;
    el.onload = () => {
      console.log("[NAVER] script loaded:", !!window.naver);
      setReady(true);
    };
    el.onerror = () => console.error("Naver Maps 스크립트 로딩 실패(리퍼러/키 확인)");
    document.head.appendChild(el);
  }, [clientId]);

  return ready;
}

/** 지도 컴포넌트 */
function NaverMap({ lat, lng, zoom = 16, style }) {
  const mapRef = useRef(null);
  const ncpClientId = process.env.REACT_APP_NAVER_MAP_ID;
  const ready = useNaverScript(ncpClientId);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { naver } = window;
    if (!naver?.maps) {
      console.error("[NAVER] naver.maps 없음");
      return;
    }

    const position = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(mapRef.current, { center: position, zoom });
    new naver.maps.Marker({ position, map });
  }, [ready, lat, lng, zoom]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: 530,
        borderRadius: 16,
        border: "1px solid #e5e5e5",
        ...style,
      }}
    />
  );
}

const DetailLodging = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* ── 🔎 검색 토글/폼 상태 ── */
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

  if (!state) {
    return (
      <div style={{ padding: 24 }}>
        잘못된 접근입니다.{" "}
        <button onClick={() => navigate("/lodging")}>숙박 목록으로</button>
      </div>
    );
  }

  return (
    <div className="detail-lodging">
      <div className="container">
        {/* ✅ 브랜딩 묶음 제거 → 공통 Header 삽입 & 축소 */}
        <div className="dl-header-wrap">
          <Header />
        </div>

        {/* 우측 상단 검색 */}
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

        {/* 상단 탭 */}
        <div className="detail-tabs">
          <button className="pill pill--black">숙박</button>
        </div>

        {/* 사진 + 상세 그리드 */}
        <section className="detail-grid">
          {/* 좌측: 사진 카드 */}
          <div className="photo-card">
            <div className="pc-shadow s1" />
            <div className="pc-shadow s2" />
            <div className="pc-body">
              <img src={state?.img} alt="숙박 이미지" className="pc-img" />
            </div>
          </div>

          {/* 우측: 텍스트 상세 */}
          <div className="detail-info">
            <h3 className="di-title">ㅇㅇ빌라 숙박</h3>
            <div className="di-hr" />
            <div className="di-meta">{state?.summary || "11.13~11.15 / 2명 / 30000w"}</div>
            <div className="di-body">
              <p className="di-desc">
                N명까지 가능합니다 침구 N개 있어요.<br />
                편의점도 도보 2분 거리에 있어요<br />
                oooo@ooo.com
              </p>

              <div className="di-actions">
                <button className="chip chip--ghost">수정</button>
                <button className="chip chip--ghost">삭제</button>
              </div>
            </div>
          </div>
        </section>

        {/* 지도 */}
        <section style={{ padding: "0 56px", marginTop: 28 }}>
          <NaverMap lat={37.5666103} lng={126.9783882} />
        </section>

        <div className="footer-text">
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default DetailLodging;
