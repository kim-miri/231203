// 웹 서버 생성,라우트 정의
const express = require("express");
const path = require("path");
const cors = require("cors");
//E xpress 애플리케이션 인스턴스 생성
const app = express();

app.use(cors());

// Express의 미들웨어 함수는 세 개의 매개변수 (req, res[, next])를 가짐
// app.use(() => {
//   console.log("서버 실행 됨");
// });

// build 디렉토리를 정적 파일로 서빙
app.use(express.static(path.join(__dirname, "../front/build")));

// 다른 라우트 핸들러 등록
app.get("/", (req, res) => {
  //res.send("<h1>백엔드에서 온 메시지<h2>");  응답하는 콘텐츠를 내보낼 때 사용
  // res.send("<h2>???<h2>");하나만 요청 받을 수 있기 때문에 출력 안됨
  res.sendFile(path.join(__dirname, "../front/build", "index.html"));
});

// 에러 핸들링: 에러 처리하는 로직이 중복되어 있어 한 곳에 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("서버 실행");
});
