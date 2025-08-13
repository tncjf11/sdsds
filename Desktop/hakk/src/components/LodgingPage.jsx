import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";                     // ✅ 공용 헤더
import "../styles/LodgingPage.css";                // ✅ 숙박 전용 CSS
import search from "../image/search.png";
import lodgingImg from "../image/image19.png";     // 숙박 아이콘
import transferImg from "../image/image21.png";    // 양도 아이콘
import chatbotImg from "../image/image32.png";
import roomImg from "../image/room-sample.png";    // 숙박 사진 샘플

// ✅ 예시 데이터(실제 API로 대체 가능)
//   날짜는 date input과 비교되므로 YYYY-MM-DD 형식으로 잡았어.
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

  // ====== 필터 상태 ======
  const [q, setQ] = useState("");        // 건물명
  const [from, setFrom] = useState("");  // 시작일
  const [to, setTo] = useState("");      // 종료일
  const [max, setMax] = useState("");    // 최대 금액
  const clearFilters = () => { setQ(""); setFrom(""); setTo(""); setMax(""); };

  // 타이핑 디바운스(검색어만)
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

      const okPrice = max === "" || s.price <= Number(max);

      let okDate = true;
      if (from && to) okDate = overlap(from, to, s.from, s.to);
      else if (from)  okDate = new Date(from) <= new Date(s.to);
      else if (to)    okDate = new Date(s.from) <= new Date(to);

      return okName && okPrice && okDate;
    });
  }, [debouncedQ, from, to, max]);

  // ====== More+ 페이지네이션 ======
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);

  // 🔁 필터가 바뀌면 첫 페이지로 되돌림
  useEffect(() => setVisible(PAGE_SIZE), [debouncedQ, from, to, max]);

  const visibleList = useMemo(() => filtered.slice(0, visible), [filtered, visible]);
  const canLoadMore = visible < filtered.length;
  const handleMore = () => setVisible(v => Math.min(v + PAGE_SIZE, filtered.length));

  // ====== 푸터 보정(절대배치 레이아웃 그대로 유지) ======
  const baseFooterTop = 1667;   // 메인 기준
  const rowHeight = 370;        // 카드(302) + 텍스트/갭 대략치
  const rows = Math.ceil(visibleList.length / 3);
  const extraRows = Math.max(0, rows - 2);
  const footerTop = baseFooterTop + extraRows * rowHeight;

  return (
    <div className="screen">
      <div className="container lodging-page">
        {/* 우측 상단 검색 아이콘 */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

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
          <div className="category-card" onClick={() => navigate("/chatbot")}>
            <img src={chatbotImg} alt="AI 챗봇" className="category-image" />
            <div className="category-label">글쓰기</div>
          </div>
        </div>

        {/* ===== 필터 바 + More ===== */}
        <div className="filter-bar">
          {/* 건물명 */}
          <div className="chip input-chip">
            <span className="chip-label">건물명</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="예: ○○빌라"
            />
          </div>

          {/* 날짜 */}
          <div className="chip date-chip">
            <span className="chip-label">날짜</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span className="tilde">~</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          {/* 금액 */}
          <div className="chip input-chip">
            <span className="chip-label">금액 ≤</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="30000"
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
        <div className="lodging-list">
          {visibleList.map((s) => (
            <div className="lodging-card" key={s.id}>
              <img src={roomImg} alt="숙박" className="lodging-image" />
              <div className="lodging-text">
                {`${s.name} / ${s.from.slice(5).replace("-", ".")}~${s.to.slice(5).replace("-", ".")} / ${s.price.toLocaleString()}w`}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="empty">조건에 맞는 숙소가 없어요.</div>
          )}
        </div>

        {/* 푸터 (행 수에 따라 자동 보정) */}
        <div className="footer-text" style={{ top: `${footerTop}px` }}>
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default LodgingPage;
