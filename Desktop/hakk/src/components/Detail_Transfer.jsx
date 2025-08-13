import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* 공용 레이아웃 */
import Header from "./Header";
import "../styles/mainpage.css";
import "../styles/Detail_Transfer.css";

/* 자산 */
import search from "../image/search.png";
import roomFallback from "../image/room-sample.png";

const DetailTransfer = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // { img, summary } 기대

  if (!state) {
    return (
      <div className="screen">
        <div className="container detail-transfer">
          <div className="dt-empty">
            잘못된 접근입니다.{" "}
            <button className="chip chip--ghost" onClick={() => navigate("/transfer")}>
              양도 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imgSrc = state?.img || roomFallback;
  const summary = state?.summary || "즉시 입주 / 150만원 / 협의 가능";

  return (
    <div className="screen">
      <div className="container detail-transfer">{/* ✅ 페이지 스코프 */}
        {/* 우측 상단 검색 아이콘 */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        {/* 공용 헤더 */}
        <Header />

        {/* 상단 탭(표시용) */}
        <div className="detail-tabs">
          <button className="pill pill--black" type="button">양도</button>
        </div>

        {/* 사진 + 상세 */}
        <section className="detail-grid">
          {/* 좌: 사진 카드 */}
          <div className="photo-card" role="img" aria-label="양도 사진">
            <div className="pc-shadow s1" />
            <div className="pc-shadow s2" />
            <div className="pc-body">
              <img src={imgSrc} alt="양도 이미지" className="pc-img" />
            </div>
          </div>

          {/* 우: 텍스트 */}
          <div className="detail-info">
            <h3 className="di-title">ㅇㅇ빌라 양도</h3>
            <div className="di-hr" />
            <div className="di-meta">{summary}</div>

            <div className="di-body">
              <p className="di-desc">
                계약 양도 관련 상세 설명이 들어갑니다.
                <br />
                보증금/월세/관리비 등 조건을 명시해 주세요.
                <br />
                oooo@ooo.com
              </p>

              <div className="di-actions">
                <button className="chip chip--ghost" type="button">수정</button>
                <button className="chip chip--ghost" type="button">삭제</button>
              </div>
            </div>
          </div>
        </section>

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
};

export default DetailTransfer;
