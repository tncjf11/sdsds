import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import house from "../image/house.png";
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
    // 가이드 버전 URL
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
  console.log("[NAVER] ncpClientId:", ncpClientId);
  const ready = useNaverScript(ncpClientId);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const { naver } = window;
    if (!naver?.maps) {
      console.error("[NAVER] naver.maps 없음");
      return;
    }

    // 가이드 방식
    const position = new naver.maps.LatLng(lat, lng);
    const map = new naver.maps.Map(mapRef.current, {
      center: position,
      zoom,
    });

    new naver.maps.Marker({
      position,
      map,
    });
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
          <div className="controls">
            <button className="search-top-btn" onClick={() => navigate("/")}>
              Let’s search!
            </button>
          </div>
        </div>

        {/* 상단 탭 */}
        <div className="detail-tabs">
          <button className="pill pill--black">숙박</button>
        </div>

        {/* ===== 사진 + 상세 그리드 ===== */}
<section className="detail-grid">
  {/* 좌측: 사진 카드 */}
  <div className="photo-card">
    <div className="pc-shadow s1" />
    <div className="pc-shadow s2" />
    <div className="pc-body">
      <img
        src={state?.img}
        alt="숙박 이미지"
        className="pc-img"
      />
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
          <span className="footer-sub">_Finding<br /> a house that suits me</span>
        </div>  
      </div>
    </div>
  );
};

export default DetailLodging;