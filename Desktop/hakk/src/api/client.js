import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 에러 공통 처리 (상태코드 기준)
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const s = err.response?.status;
    if (s === 404) alert("존재하지 않는 매물입니다.");
    else if (s === 400) alert("요청이 올바르지 않아요(PIN 불일치 등).");
    else if (s === 429) alert("잠시 후 다시 시도해 주세요(요청이 너무 많음).");
    else if (s >= 500) alert("서버 오류입니다.");
    return Promise.reject(err);
  }
);

export default client;
