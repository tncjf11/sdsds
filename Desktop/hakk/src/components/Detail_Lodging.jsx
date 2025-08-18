// src/components/Detail_Lodging.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import house from "../image/house.png";
import "../styles/Detail_Lodging.css";

/* ===== 공통 유틸 ===== */
const API_BASE = ""; // CRA dev-proxy 사용 시 빈 문자열
const mmdd = (iso) => (iso ? iso.slice(5).replace("-", ".") : "");
function buildImgUrl(u, fallback) {
  if (!u) return fallback;
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
}

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
    el.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`;
    el.async = true;
    el.onload = () => setReady(true);
    el.onerror = () => console.error("Naver Maps 스크립트 로딩 실패");
    document.head.appendChild(el);
  }, [clientId]);
  return ready;
}

/** 지도: lat/lng 또는 address로 표시 */
function NaverMap({ lat, lng, address, zoom = 16, style }) {
  const mapRef = useRef(null);
  const ncpClientId = process.env.REACT_APP_NAVER_MAP_ID;
  const ready = useNaverScript(ncpClientId);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { naver } = window;
    if (!naver?.maps) return;

    const renderAt = (position) => {
      const map = new naver.maps.Map(mapRef.current, { center: position, zoom });
      new naver.maps.Marker({ position, map });
    };

    if (lat != null && lng != null) {
      renderAt(new naver.maps.LatLng(lat, lng));
    } else if (address && naver.maps.Service?.geocode) {
      naver.maps.Service.geocode({ query: address }, (status, res) => {
        if (status !== naver.maps.Service.Status.OK || !res?.v2?.addresses?.length) return;
        const a = res.v2.addresses[0];
        const pos = new naver.maps.LatLng(Number(a.y), Number(a.x));
        renderAt(pos);
      });
    }
  }, [ready, lat, lng, address, zoom]);

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
  const { id } = useParams();

  // 🔎 상단 검색
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

  /* ===== 데이터 로딩(STAY) ===== */
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setLoading(true);
    setErr("");

    fetch(`/api/listings/stay/${id}`)
      .then(async (resp) => {
        if (!resp.ok)
          throw new Error(`상세 조회 실패 (${resp.status}) ${await resp.text().catch(() => "")}`);
        return resp.json();
      })
      .then((json) => {
        if (alive) setData(json);
      })
      .catch((e) => {
        if (alive) setErr(e.message || String(e));
      })
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [id]);

  /* ===== 수정: 반드시 수정페이지로 이동 ===== */
  const toEdit = () => {
    if (!data) return;
    navigate(`/lodging/edit/${id}`, {
      state: {
        type: "lodging", // 탭 고정 기본값
        roomId: id,
        initialValues: {
          building: data.buildingName || "",
          content: data.description || "",
          address: data.address || "",
          date:
            data.startDate && data.endDate
              ? `${data.startDate} ~ ${data.endDate}`
              : "",
          people: data.guests != null ? String(data.guests) : "",
          amount: data.price != null ? String(data.price) : "",
          pin: "", // 수정 페이지에서 재입력
        },
      },
    });
  };

  /* ===== 삭제: PIN 확인 → DELETE → 메인으로 이동 ===== */
  const onDelete = async () => {
    const pin = window.prompt("삭제 PIN을 입력하세요");
    if (!pin) return;
    try {
      const resp = await fetch(`/api/listings/${id}?pin=${encodeURIComponent(pin)}`, {
        method: "DELETE",
      });
      if (!resp.ok) {
        const msg = await resp.text().catch(() => "");
        throw new Error(`삭제 실패 (${resp.status}) ${msg}`);
      }
      alert("삭제되었습니다.");
      navigate("/"); // 메인으로 이동
    } catch (e) {
      alert(String(e.message ?? e));
    }
  };

  if (!id) {
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

          {/* 🔎 검색 */}
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
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
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

        {/* 사진 + 상세 그리드 */}
        <section className="detail-grid">
          {/* 좌측: 사진 카드 */}
          <div className="photo-card">
            <div className="pc-shadow s1" />
            <div className="pc-shadow s2" />
            <div className="pc-body">
              <img
                src={buildImgUrl(data?.photos?.[0], house)}
                alt="숙박 이미지"
                className="pc-img"
              />
            </div>
          </div>

          {/* 우측: 텍스트 상세 */}
          <div className="detail-info">
            {loading && <div className="di-title">불러오는 중…</div>}
            {err && !loading && <div className="di-title">오류: {err}</div>}
            {!loading && !err && (
              <>
                <h3 className="di-title">{data?.buildingName ?? "숙박"}</h3>
                <div className="di-hr" />
                <div className="di-meta">
                  {`${data?.startDate ? mmdd(data.startDate) : ""}${
                    data?.startDate || data?.endDate ? "~" : ""
                  }${data?.endDate ? mmdd(data.endDate) : ""} / ${
                    data?.guests != null ? `${data.guests}명` : ""
                  } / ${
                    data?.price != null ? data.price.toLocaleString() + "원" : ""
                  }`}
                </div>
                <div className="di-body">
                  <p className="di-desc">
                    {data?.description || "설명이 없습니다."}
                    {data?.address ? (
                      <>
                        <br />
                        주소: {data.address}
                      </>
                    ) : null}
                  </p>

                  <div className="di-actions">
                    <button
                      type="button"
                      className="chip chip--ghost"
                      onClick={toEdit}
                      disabled={loading || !!err}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="chip chip--ghost"
                      onClick={onDelete}
                      disabled={loading || !!err}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* 지도 */}
        <section style={{ padding: "0 56px", marginTop: 28 }}>
          {data?.address ? (
            <NaverMap address={data.address} />
          ) : (
            <div
              style={{
                width: "100%",
                height: 530,
                display: "grid",
                placeItems: "center",
                borderRadius: 16,
                border: "1px solid #e5e5e5",
              }}
            >
              주소 정보가 없어 지도를 표시할 수 없습니다.
            </div>
          )}
        </section>

        <div className="footer-text">
          FIT ROOM
          <br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default DetailLodging;
