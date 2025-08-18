import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import house from "../image/house.png";
import "../styles/Detail_Transfer.css";
import { popDraft, removeDraft } from "../utils/draft"; // ✅ 드래프트 유틸 추가

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

const DetailTransfer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* ── 🔎 상단 검색 UI (원본 유지) ── */
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
        <button onClick={() => navigate("/transfer")}>양도 목록으로</button>
      </div>
    );
  }

  // ✅ 드래프트/식별자 키(백엔드 붙이면 서버 PK로 교체)
  const roomId = state?.id ?? state?.roomId ?? state?.building ?? "unknown";

  // ✅ 본문(content): 상세에 보이는 문단을 그대로 업로드로 넘길 값
  const detailContent =
    state?.content ||
    `N명까지 가능합니다 침구 N개 있어요.
편의점도 도보 2분 거리에 있어요
oooo@ooo.com`;

  // ✅ 메타(상단 요약): 주소/가격/기간(양도 전용 필드)
  const metaAddress = state?.address ?? "대곡빌라";
  const metaPrice = state?.price ?? "150만원";
  const metaPeriod = state?.period ?? "바로입주";
  const metaText = `${metaAddress} / ${metaPrice} / ${metaPeriod}`;

  return (
    <div className="detail-transfer">
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
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* 🔎 검색 버튼/폼 유지 */}
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
          <button className="pill pill--black">양도</button>
        </div>

        {/* ===== 사진 + 상세 그리드 ===== */}
        <section className="detail-grid">
          {/* 좌측: 사진 카드 */}
          <div className="photo-card">
            <div className="pc-shadow s1" />
            <div className="pc-shadow s2" />
            <div className="pc-body">
              <img src={state?.img} alt="양도 이미지" className="pc-img" />
            </div>
          </div>

          {/* 우측: 텍스트 상세 */}
          <div className="detail-info">
            <h3 className="di-title">{(state?.building ?? "ㅇㅇ빌라") + " 양도"}</h3>
            <div className="di-hr" />
            <div className="di-meta">{state?.summary || metaText}</div>

            <div className="di-body">
              <p className="di-desc">{detailContent}</p>

              <div className="di-actions">
                {/* ✅ 수정: 드래프트 복원 → 업로드 페이지로 이동 (양도 전용 필드 매핑) */}
                <button
                  className="chip chip--ghost"
                  onClick={() => {
                    const draft = popDraft(roomId);
                    const initialValues = {
                      // ⬇ UploadPage의 "transfer" 폼 키와 1:1 매핑
                      building: state?.building ?? "ㅇㅇ빌라",
                      address: metaAddress,
                      price: metaPrice,
                      period: metaPeriod,
                      content: detailContent,
                      pin: state?.pin ?? "",
                      img: state?.img ?? "",
                    };
                    navigate("/upload", {
                      state: {
                        mode: "edit",
                        type: "transfer", // ⬅ 양도 탭 강제
                        roomId,
                        initialValues: draft ?? initialValues,
                      },
                    });
                  }}
                >
                  수정
                </button>

                {/* ✅ 삭제: 드래프트 폐기 + 얼럿 + 메인(또는 목록) 이동 */}
                <button
                  className="chip chip--ghost"
                  onClick={() => {
                    removeDraft(roomId);
                    alert("삭제 완료!");
                    navigate("/transfer"); // 목록으로 이동
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

export default DetailTransfer;
