import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mainpage.css";
import "../styles/UploadPage.css";

import house from "../image/house.png";
/* import search from "../image/search.png";  // ⛔️ 메인과 동일한 SVG 버튼 사용이라 필요없어 주석 */
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import uploadImg from "../image/image32.png";

export const TagGroup = () => (
  <div className="tag-group">
    <div className="tag tag-outline" style={{ transform: "rotate(-6.33deg)" }}>
      short_term
    </div>
    <div className="tag tag-outline-white" style={{ transform: "rotate(2.37deg)" }}>
      to long-term
    </div>
    <div className="tag tag-filled" style={{ transform: "rotate(-5.35deg)" }}>
      rentals!
    </div>
  </div>
);

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [building, setBuilding] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [period, setPeriod] = useState("");
  const [content, setContent] = useState("");
  const [pin, setPin] = useState("");
  const [uploadType, setUploadType] = useState("transfer");

  // 🔎 메인/숙박/양도와 동일한 검색 상태 & 로직
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
  // 바깥 클릭 시 닫기 + 포커스 복귀
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!searchOpen) return;
      const form = document.getElementById("uploadpage-top-search-form");
      if (!form?.contains(e.target) && !searchBtnRef.current?.contains(e.target)) {
        setSearchOpen(false);
        searchBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [searchOpen]);

  const onPickImage = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };
  const onUpload = () => {
    alert("업로드 완료(목업)!");
  };

  return (
    <div className="screen upload-page">
      <div className="container">
        {/* 🔎 우측 상단 검색 (메인과 동일한 버튼+폼) */}
        <div className="top-search">
          <button
            ref={searchBtnRef}
            className="top-search__toggle"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-controls="uploadpage-top-search-form"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="top-search__label">검색</span>
          </button>

          <form
            id="uploadpage-top-search-form"
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

        <div className="header">
          <h1 className="main-title">
            FIT ROOM<br />_Finding <br /> a house that suits me
          </h1>
          {/* 🏠 홈 이미지 클릭 → 메인 이동 */}
          <img
            src={house}
            alt="house"
            className="house-image"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="category-wrapper">
          <div className="category-card" onClick={() => navigate("/lodging")}>
            <img src={lodgingImg} alt="숙박" className="category-image" />
            <div className="category-label">숙박</div>
          </div>
          <div className="category-card" onClick={() => navigate("/transfer")}>
            <img src={transferImg} alt="양도" className="category-image" />
            <div className="category-label">양도</div>
          </div>
          <div className="category-card active">
            <img src={uploadImg} alt="업로드" className="category-image" />
            <div className="category-label">업로드</div>
          </div>
        </div>

        <div className="summary-box">
          <div className="summary-check">Check out</div>
          <p className="summary-text">your home at a glance,</p>
        </div>
        <TagGroup />

        <section className="upload-inner">
          <div className="upload-tabs">
            <button
              type="button"
              className={`tab ${uploadType === "transfer" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setUploadType("transfer")}
              aria-pressed={uploadType === "transfer"}
            >
              양도
            </button>
            <button
              type="button"
              className={`tab ${uploadType === "lodging" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setUploadType("lodging")}
              aria-pressed={uploadType === "lodging"}
            >
              숙박
            </button>
            <button
              type="button"
              className={`tab ${uploadType === "ai" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setUploadType("ai")}
              aria-pressed={uploadType === "ai"}
            >
              AI 글수정
            </button>
          </div>

          <div className="upload-grid">
            <div className="upload-card" onClick={onPickImage} role="button" tabIndex={0}>
              <div className="upload-card__shadow shadow--1" />
              <div className="upload-card__shadow shadow--2" />
              <div className="upload-card__body">
                {preview ? (
                  <img src={preview} alt="preview" className="upload-preview" />
                ) : (
                  <span className="plus">+</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  hidden
                />
              </div>
            </div>

            <div className="upload-form">
              <div className="title-line">
                <input
                  className="title-input"
                  placeholder="건물명"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                />
                <div className="underline" />
              </div>

              <div className="chips">
                <input
                  className="chip-input"
                  type="text"
                  placeholder="주소"
                  aria-label="주소"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <input
                  className="chip-input"
                  type="text"
                  placeholder="가격 (예: 150만원)"
                  aria-label="가격"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  className="chip-input"
                  type="text"
                  placeholder="기간 (예: 바로입주 / 11.2~11.5)"
                  aria-label="기간"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div>

              <div className="summary summary--form">
                {(address || price || period)
                  ? `${address || ""} / ${price || ""} / ${period || ""}`
                  : "○○빌라 / 150만원 / 바로입주"}
              </div>

              <div className="editor">
                <textarea
                  className="editor-area"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="글쓰기 / 고객과의 컨택을 위한 연락처를 남겨주세요!"
                />
              </div>

              <div className="bottom-actions">
                <div className="pin-wrap">
                  <label className="pin-label">PIN</label>
                  <input
                    className="pin-input"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <button className="upload-btn" onClick={onUpload}>업로드</button>
              </div>
            </div>
          </div>
        </section>

        <div className="footer-text">
          FIT ROOM<br />
          <span className="footer-sub">_Finding<br /> a house that suits me</span>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
