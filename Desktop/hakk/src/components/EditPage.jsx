// src/components/EditPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/mainpage.css";
import "../styles/EditPage.css"; // .edit-page 네임스페이스
import lodgingImg from "../image/image19.png";
import transferImg from "../image/image21.png";
import editImg from "../image/image32.png";

// ===== 유틸 =====
const pad2 = (n) => String(n).padStart(2, "0");
function parseDateRange(input) {
  if (!input) return { startDate: null, endDate: null };
  const now = new Date();
  const yyyy = now.getFullYear();
  const iso = input.match(/(\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})/);
  if (iso) return { startDate: iso[1], endDate: iso[2] };
  const md = input.match(/(\d{1,2})\.(\d{1,2})\s*~\s*(\d{1,2})\.(\d{1,2})/);
  if (md) {
    const s = `${yyyy}-${pad2(md[1])}-${pad2(md[2])}`;
    const e = `${yyyy}-${pad2(md[3])}-${pad2(md[4])}`;
    return { startDate: s, endDate: e };
  }
  return { startDate: null, endDate: null };
}
const toInt = (v) => {
  if (v == null) return null;
  const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
  return Number.isNaN(n) ? null : n;
};
const tabToType = (tab) => (tab === "lodging" ? "STAY" : "TRANSFER");
const typeToTab = (type) => (type === "STAY" ? "lodging" : "transfer");

// ===== API (fetch 사용) =====
async function patchListing(id, body) {
  const resp = await fetch(`/api/listings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const msg = await resp.text().catch(() => "");
    throw new Error(`PATCH 실패 (${resp.status}) ${msg}`);
  }
  return resp.json().catch(() => ({}));
}

const EditPage = () => {
  const navigate = useNavigate();
  const { id: idFromParams } = useParams();
  const { state } = useLocation(); // { type, roomId, initialValues }

  // ===== 이미지 선택(미리보기만; 파일 업로드는 별도 API 필요) =====
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]);
  const onPickImage = () => fileInputRef.current?.click();
  const onFileChange = (e) => {
    const list = Array.from(e.target.files ?? []);
    setFiles(list);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(list[0] ? URL.createObjectURL(list[0]) : null);
  };
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  // ===== 탭: 상세에서 온 타입이 기본값이지만, 수정페이지에서는 전환 가능 =====
  const initialTab = useMemo(() => {
    if (state?.type === "lodging" || state?.type === "transfer") return state.type;
    if (state?.initialValues?.date !== undefined) return "lodging";
    return "transfer";
  }, [state]);
  const [activeTab, setActiveTab] = useState(initialTab);

  // ===== 폼 =====
  const [forms, setForms] = useState({
    transfer: { building: "", content: "", address: "", price: "", period: "" },
    lodging: { building: "", content: "", date: "", people: "", amount: "", address: "" },
  });
  const form = forms[activeTab];
  const onFormChange = (field) => (e) =>
    setForms((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: e.target.value } }));

  // PIN 확인
  const [pinConfirm, setPinConfirm] = useState("");

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
  const submitSearch = () =>
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!searchOpen) return;
      const formEl = document.getElementById("editpage-top-search-form");
      if (!formEl?.contains(e.target) && !searchBtnRef.current?.contains(e.target)) {
        setSearchOpen(false);
        searchBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [searchOpen]);

  // ===== 초기값: state.initialValues 우선, 없으면 GET /api/listings/:id =====
  const listingId = idFromParams ?? state?.roomId; // ← 항상 params 우선 (undefined 방지)
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // 상세에서 넘겨준 값 사용
    if (state?.initialValues) {
      const tab = initialTab;
      setForms((prev) => ({ ...prev, [tab]: { ...prev[tab], ...state.initialValues } }));
      return;
    }
    // 직접 새로고침 등으로 들어온 경우 서버에서 로드
    if (!listingId) return;
    setLoading(true);
    (async () => {
      try {
        const resp = await fetch(`/api/listings/${listingId}`);
        if (!resp.ok) throw new Error("상세 불러오기에 실패했습니다.");
        const data = await resp.json(); // { type:'STAY'|'TRANSFER', ... }
        const tab = typeToTab(data?.type);
        const next = { ...forms[tab] };
        next.building = data?.buildingName ?? "";
        next.content = data?.description ?? "";
        next.address = data?.address ?? "";
        if (tab === "lodging") {
          next.date =
            data?.startDate && data?.endDate ? `${data.startDate} ~ ${data.endDate}` : "";
          next.people = data?.guests != null ? String(data.guests) : "";
          next.amount = data?.price != null ? String(data.price) : "";
        } else {
          next.period =
            data?.startDate && data?.endDate ? `${data.startDate} ~ ${data.endDate}` : "";
          next.price = data?.price != null ? String(data.price) : "";
        }
        setActiveTab(tab); // 서버 타입 기준으로 탭 맞추되, 이후 사용자가 변경 가능
        setForms((prev) => ({ ...prev, [tab]: next }));
      } catch (e) {
        console.error(e);
        alert(String(e.message ?? e));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  // ===== 제출: PATCH /api/listings/{id} (type 반영) =====
  const onUpdate = async () => {
    try {
      if (!listingId) return alert("잘못된 접근입니다 (id 없음)");
      if (!form.building?.trim()) return alert("건물명을 입력해 주세요.");
      if (!pinConfirm?.trim()) return alert("업로드 시 사용한 PIN을 입력해 주세요.");

      const chosenType = tabToType(activeTab); // 'STAY' | 'TRANSFER'
      const body = {
        type: chosenType, // ← 탭에서 선택한 최종 타입을 백엔드에 전달
        pin: pinConfirm.trim(),
        buildingName: form.building?.trim(),
        description: form.content || undefined,
        address: form.address || undefined,
      };

      if (activeTab === "lodging") {
        const { startDate, endDate } = parseDateRange(form.date);
        if (startDate) body.startDate = startDate;
        if (endDate) body.endDate = endDate;
        const guests = toInt(form.people);
        if (guests != null) body.guests = guests;
        const price = toInt(form.amount);
        if (price != null) body.price = price;
      } else {
        const { startDate, endDate } = parseDateRange(form.period);
        if (startDate) body.startDate = startDate;
        if (endDate) body.endDate = endDate;
        const price = toInt(form.price);
        if (price != null) body.price = price;
      }

      await patchListing(listingId, body);

      // 최종 타입 기준 상세 페이지로 이동
      const nextPath = chosenType === "STAY" ? `/lodging/${listingId}` : `/transfer/${listingId}`;
      alert("수정 완료!");
      navigate(nextPath);
    } catch (e) {
      console.error(e);
      alert(String(e.message ?? e));
    }
  };

  return (
    <div className="screen edit-page">
      <div className="container">
        {/* 🔎 상단 검색 */}
        <div className="top-search">
          <button
            ref={searchBtnRef}
            className="top-search__toggle"
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            aria-controls="editpage-top-search-form"
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="top-search__label">검색</span>
          </button>
          <form
            id="editpage-top-search-form"
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

        {/* 공용 헤더 */}
        <Header />

        {/* 카테고리 카드 */}
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
            <img src={editImg} alt="수정" className="category-image" />
            <div className="category-label">수정</div>
          </div>
        </div>

        {/* 본문 */}
        <section className="upload-inner">
          {/* 탭: 전환 가능 */}
          <div className="upload-tabs">
            <button
              type="button"
              className={`tab ${activeTab === "transfer" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setActiveTab("transfer")}
              aria-pressed={activeTab === "transfer"}
            >
              양도
            </button>
            <button
              type="button"
              className={`tab ${activeTab === "lodging" ? "tab--active" : "tab--ghost"}`}
              onClick={() => setActiveTab("lodging")}
              aria-pressed={activeTab === "lodging"}
            >
              숙박
            </button>
          </div>

          <div className="upload-grid">
            {/* 좌: 이미지 카드 (미리보기) */}
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
                  multiple
                  onChange={onFileChange}
                  hidden
                />
              </div>
            </div>

            {/* 우: 폼 */}
            <div className="upload-form">
              {/* 제목 */}
              <div className="title-line">
                <input
                  className="title-input"
                  placeholder="건물명"
                  value={form.building}
                  onChange={onFormChange("building")}
                />
                <div className="underline" />
              </div>

              {/* 칩 영역 */}
              <div className={`chips ${activeTab === "lodging" ? "is-lodging" : "is-transfer"}`}>
                {activeTab === "lodging" ? (
                  <>
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
                      value={form.date}
                      onChange={onFormChange("date")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="인원수 (예: 2명)"
                      value={form.people}
                      onChange={onFormChange("people")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="금액 (예: 500000)"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.amount}
                      onChange={onFormChange("amount")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="주소"
                      value={form.address}
                      onChange={onFormChange("address")}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="주소"
                      value={form.address}
                      onChange={onFormChange("address")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="가격 (예: 1500000)"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={form.price}
                      onChange={onFormChange("price")}
                    />
                    <input
                      className="chip-input"
                      type="text"
                      placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
                      value={form.period}
                      onChange={onFormChange("period")}
                    />
                  </>
                )}
              </div>

              {/* 요약 */}
              <div className="summary summary--form">
                {activeTab === "lodging"
                  ? form.date || form.people || form.amount || form.address
                    ? `${form.date || ""} / ${form.people || ""} / ${form.amount || ""} / ${form.address || ""}`
                    : "11.2~11.5 / 2명 / 500000 / ○○빌라"
                  : form.address || form.price || form.period
                    ? `${form.address || ""} / ${form.price || ""} / ${form.period || ""}`
                    : "○○빌라 / 1500000 / 바로입주"}
              </div>

              {/* 본문 */}
              <div className="editor">
                <textarea
                  className="editor-area"
                  value={form.content}
                  onChange={onFormChange("content")}
                  placeholder="글쓰기 / 고객과의 컨택을 위한 연락처를 남겨주세요!"
                />
              </div>

              {/* 하단: PIN + 수정완료 */}
              <div className="bottom-actions">
                <div className="pin-wrap">
                  <label className="pin-label">PIN 확인</label>
                  <input
                    className="pin-input"
                    value={pinConfirm}
                    onChange={(e) => setPinConfirm(e.target.value)}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>

                <button type="button" className="upload-btn" onClick={onUpdate} disabled={loading}>
                  수정완료
                </button>
              </div>
            </div>
          </div>
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

export default EditPage;
