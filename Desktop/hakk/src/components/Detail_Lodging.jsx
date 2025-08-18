import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import house from "../image/house.png";
import "../styles/Detail_Lodging.css";
import { popDraft, removeDraft } from "../utils/draft";

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
    el.onload = () => setReady(true);
    el.onerror = () => console.error("Naver Maps 스크립트 로딩 실패");
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
    if (!naver?.maps) return;

    const position = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(mapRef.current, {
      center: position,
      zoom,
    });

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

  const roomId = state?.id ?? state?.roomId ?? state?.building ?? "unknown";

  // ✅ 상세 본문 텍스트 (업로드 content에 넘길 값)
  const detailContent = `N명까지 가능합니다 침구 N개 있어요.
편의점도 도보 2분 거리에 있어요
oooo@ooo.com`;

  return (
    <div className="detail-lodging">
      <div className="container">
        {/* 헤더 */}
        <div className="header">
          <div className="branding">
            <p className="branding-text">
              FIT ROOM<br />_Finding<br />a house that suits me
            </p>
            <img
              className="house-icon"
              src={house}
              alt="house"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>
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
        </div>

        {/* 상단 탭 */}
        <div className="detail-tabs">
          <button className="pill pill--black">숙박</button>
        </div>

        {/* 사진 + 상세 */}
        <section className="detail-grid">
          <div className="photo-card">
            <div className="pc-shadow s1" />
            <div className="pc-shadow s2" />
            <div className="pc-body">
              <img src={state?.img} alt="숙박 이미지" className="pc-img" />
            </div>
          </div>

          <div className="detail-info">
            <h3 className="di-title">ㅇㅇ빌라 숙박</h3>
            <div className="di-hr" />
            <div className="di-meta">{state?.summary || "11.02~11.05 / 2명 / 30,000원"}</div>
            <div className="di-body">
              <p className="di-desc">{detailContent}</p>

              <div className="di-actions">
                {/* ✅ 수정 버튼 */}
                <button
                  className="chip chip--ghost"
                  onClick={() => {
                    const draft = popDraft(roomId);

                    // ✅ 업로드 페이지와 호환되는 초기값
                    const initialValues = {
                      building: state?.building ?? "ㅇㅇ빌라",
                      date: state?.date ?? "11.02 ~ 11.05",
                      people: state?.people ?? "2명",
                      amount: state?.amount ?? "30,000원",
                      address: state?.address ?? "ㅇㅇ빌라",
                      content: state?.content ?? detailContent, // 본문 내용 연결
                      pin: state?.pin ?? "",
                      img: state?.img ?? "",
                    };

                    navigate("/upload", {
                      state: {
                        mode: "edit",
                        type: "lodging",
                        roomId,
                        initialValues: draft ?? initialValues,
                      },
                    });
                  }}
                >
                  수정
                </button>

                {/* 삭제 버튼 */}
                <button
                  className="chip chip--ghost"
                  onClick={() => {
                    removeDraft(roomId);
                    alert("삭제 완료!");
                    navigate("/");
                  }}
                >
                  삭제
                </button>
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
