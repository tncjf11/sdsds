import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";                       // ✅ 공용 헤더
import "../styles/TransferPage.css";                 // ✅ 양도 전용 CSS
import search from "../image/search.png";
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import chatbotImg from "../image/image32.png";
import roomImg from "../image/room-sample.png";

// ✅ 더미 데이터(필요 시 API로 교체)
const TRANSFER_LIST = [
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
  "대곡빌라 / 150만원 / 바로입주",
];

const TransferPage = () => {
  const navigate = useNavigate();

  // ===== More+ 로직 =====
  const PAGE_SIZE = 6;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const visibleList = useMemo(() => TRANSFER_LIST.slice(0, visible), [visible]);
  const canLoadMore = visible < TRANSFER_LIST.length;
  const handleMore = () => setVisible(v => Math.min(v + PAGE_SIZE, TRANSFER_LIST.length));

  // ===== 푸터 자동 위치 보정 =====
  // 기존의 추정치 계산(baseFooterTop/rowHeight) 대신, 리스트 DOM의 실제 높이를 사용
  const listRef = useRef(null);
  const [footerTop, setFooterTop] = useState(1667); // 초기 대략치(메인 기준)

  useEffect(() => {
    const calcFooter = () => {
      const el = listRef.current;
      if (!el) return;
      const top = el.offsetTop || 0;        // 리스트 상단(부모 기준)
      const height = el.offsetHeight || 0;  // 실제 렌더된 높이
      const margin = 60;                    // 리스트와 푸터 사이 간격
      setFooterTop(top + height + margin);
    };

    calcFooter(); // 최초 계산

    // 이미지 로딩 완료 후에도 다시 계산(지연 로드 대비)
    const imgs = listRef.current?.querySelectorAll("img") || [];
    imgs.forEach(img => {
      if (!img.complete) img.addEventListener("load", calcFooter, { once: true });
    });

    // 창 크기 변화 시 재계산
    window.addEventListener("resize", calcFooter);

    // 레이아웃 안정화 후 한 번 더
    const id = setTimeout(calcFooter, 0);

    return () => {
      window.removeEventListener("resize", calcFooter);
      clearTimeout(id);
    };
  }, [visibleList.length]); // More+로 카드 수가 변할 때마다 재계산

  return (
    <div className="screen">
      <div className="container transfer-page">{/* ✅ 페이지 스코프 */}
        {/* 우측 상단 검색 아이콘 (메인과 동일 위치) */}
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

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
          <div className="category-card" onClick={() => navigate("/chatbot")}>
            <img src={chatbotImg} alt="AI 챗봇" className="category-image" />
            <div className="category-label">업로드</div>
          </div>
        </div>

        {/* 필터 + More */}
        <button
          type="button"
          className={`more-btn ${canLoadMore ? "" : "disabled"}`}
          onClick={handleMore}
          disabled={!canLoadMore}
        >
          More +
        </button>

        {/* 리스트 */}
        <div className="transfer-list" ref={listRef}>
          {visibleList.map((text, i) => (
            <div className="transfer-card" key={i}>
              <img src={roomImg} alt="양도" className="transfer-image" />
              <div className="transfer-text">{text}</div>
            </div>
          ))}
        </div>

        {/* 푸터 (리스트 실제 높이에 맞춰 자동 보정) */}
        <div className="footer-text" style={{ top: `${footerTop}px` }}>
          FIT ROOM<br />
          <span className="footer-sub">_Finding a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
