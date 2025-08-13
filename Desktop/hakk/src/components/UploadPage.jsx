import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mainpage.css";
import "../styles/UploadPage.css";

import house from "../image/house.png";
import search from "../image/search.png";
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
    <div className="screen upload-page">  {/* 여기 .screen 추가 */}
      <div className="container">
        <div
          className="search-button"
          role="button"
          tabIndex={0}
          onClick={() => navigate("/search")}
        >
          <div className="search-label"></div>
        </div>
        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => navigate("/search")}
        />

        <div className="header">
          <h1 className="main-title">
            FIT ROOM<br />_Finding <br /> a house that suits me
          </h1>
          <img src={house} alt="house" className="house-image" />
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
