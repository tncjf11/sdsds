import client from "./client";

// 1) 목록
export const getStayList = () => client.get("/api/listings/stay");
export const getTransferList = () => client.get("/api/listings/transfer");

// 2) 상세 (조회수 자동 증가)
export const getStayDetail = (id) => client.get(`/api/listings/stay/${id}`);
export const getTransferDetail = (id) =>
  client.get(`/api/listings/transfer/${id}`);

// 3) 등록(원샷 업로드: JSON + 이미지들)
export const createListingWithUpload = (dataObj, files) => {
  const form = new FormData();
  form.append("data", JSON.stringify(dataObj)); // key: data (JSON 문자열)
  files.forEach((f) => form.append("files", f)); // key: files (여러 개)
  return client.post("/api/listings/with-upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 4) 수정(PATCH, body는 JSON)
export const updateListing = (id, body) =>
  client.patch(`/api/listings/${id}`, body);

// 5) 삭제(쿼리에 pin 포함)
export const deleteListing = (id, pin) =>
  client.delete(`/api/listings/${id}`, { params: { pin } });

// 6) 검색
export const searchStay = (q) =>
  client.get("/api/listings/stay/search", { params: q }); // name, startDate, endDate, minPrice, maxPrice

// 7) TOP 10
export const getTopStay = () => client.get("/api/listings/top/stay");
export const getTopTransfer = () => client.get("/api/listings/top/transfer");

// 8) 이미지 업로드(테스트용)
export const uploadImages = (files) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return client.post("/api/uploads/images", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 9) AI 카피라이팅
export const polishCopy = (payload) => client.post("/api/ai/polish", payload);
