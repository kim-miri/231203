const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const cors = require("cors");
const { ObjectId } = mongoose.Types;
const sha = require("sha256");
const session = require("express-session");

// CORS 설정 모든 도메인에서의 요청을 허용
// CORS 설정
const corsOptions = {
  origin: "http://localhost:3000", // 허용할 출처
  optionsSuccessStatus: 200, // 프리플라이트 요청에 대한 응답 상태 코드
};
app.use(cors(corsOptions));

//Express.js 4.x 버전에서는 body-parser 미들웨어를 사용하여 요청 본문을 파싱하였으나 Express.js 4.18.2 버전에서는 body-parser 미들웨어를 사용하지 않고도 요청 본문을 파싱할 수 있음
//  express.json()과 express.urlencoded() 메소드를 사용하여 JSON 및 URL-encoded 데이터를 파싱
app.use(express.json());
// 세션 설정. 앞으로 옮겨 놓는게 좋음
app.use(
  session({
    // 세션 아이디 암호화를 위한 재료 값
    secret: "dfgcsdga234254fsdcs0sdfs12",
    // 세션을 접속할 때마다 새로운 세션 식별자(sid)의 발급 여부를 결정. 일반적으로 false로 설정
    resave: false,
    // 세션을 사용하기 전까지 세션 식별자를 발급하지 않도록 함. 일반적으로 true 설정
    saveUninitialized: true,
  })
);

const PORT = process.env.PORT || 8080;
const URL =
  "mongodb+srv://admin:1234@cluster0.dlxi4ez.mongodb.net/?retryWrites=true&w=majority";

// MongoDB에 연결
let mydb;
mongoose
  .connect(URL, {
    dbName: "coffee", // 실제로 데이터 저장할 db명. 안쓰면 새로운 DB에 저장
  })
  .then(() => {
    console.log("MongoDB에 연결되었습니다.");
    // mongoose.connection.db를 통해 데이터베이스 참조
    mydb = mongoose.connection.db; // 기본값(test를 만듦)
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err);
  });

// Post 스키마 정의
const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  wdate: { type: Date, default: Date.now }, // wdate를 Date 타입으로 변경. 작성 날짜를 기준으로 정렬하기 위해
  writer: String,
});

// Post 모델 정의
const Post = mongoose.model("Post", postSchema);

// 모델 생성. 이 모델은 MongoDB에서 "videos" 컬렉션과 매핑
// 첫 번째 매개변수로 모델 이름을, 두 번째 매개변수로 스키마를, 세 번째 매개변수로 컬렉션 이름

// login
const checkUserSession = (req, res) => {
  if (req.session.user) {
    console.log("세션 유지");
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
};

app.get("/login", checkUserSession);
app.get("/", checkUserSession);

app.post("/login", async (req, res) => {
  const { userId, userPw } = req.body;
  console.log(`id: ${userId}`);
  console.log(`pw: ${userPw}`);

  try {
    // 여기서 비번 확인은 안됨. 해시로 변환된 값을 비교하기 때문에
    const result = await mydb.collection("account").findOne({ userId });

    if (!result) {
      return res.json({ error: "사용자를 찾을 수 없습니다" });
    } else if (result.userPw && result.userPw === sha(userPw)) {
      req.session.user = { userId, userPw };
      console.log("새로운 로그인");
      res.json({ user: req.session.user });
    } else {
      return res.json({ error: "비밀번호가 틀렸습니다" });
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    res.status(500).json({ error: "서버 오류" });
  }
});

// logout
app.get("/logout", (req, res) => {
  console.log("로그아웃");
  // 현재 도메인의 세션 삭제
  req.session.destroy();

  // 로그아웃에 성공했을 때 user에 null 넘김
  res.json({ user: null });
});

// 회원가입
// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

app.post("/signup", async (req, res) => {
  console.log(req.body.userId);
  console.log(req.body.userPw);
  console.log(req.body.userGroup);
  console.log(req.body.userEmail);

  try {
    const collection = mydb.collection("account");
    await collection.insertOne({
      userId: req.body.userId,
      // userPw: req.body.userPw,
      // 암호화된 해시값으로 저장됨
      userPw: sha(req.body.userPw),
      userGroup: req.body.userGroup,
      userEmail: req.body.userEmail,
    });

    console.log("회원가입 성공");
    res.json({ message: "회원가입 성공" });
  } catch (err) {
    console.error("회원가입 에러:", err);
    res.status(500).send({ error: err.message });
  }
});

// 에러 핸들링: 에러 처리하는 로직이 중복되어 있어 한 곳에 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 포트에서 실행 중입니다.`);
});
