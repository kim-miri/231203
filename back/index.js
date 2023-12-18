const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const cors = require("cors");
const { ObjectId } = mongoose.Types;
const sha = require("sha256");
const session = require("express-session");
const path = require("path");

// app.use(cors());

app.use(express.static(path.join(__dirname, "/build")));

app.use(express.json());
// 세션 설정. 앞으로 옮겨 놓는게 좋음
app.use(
  session({
    secret: "dfgcsdga234254fsdcs0sdfs12",
    resave: false,
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
    dbName: "coffee",
  })
  .then(() => {
    console.log("MongoDB에 연결되었습니다.");
    mydb = mongoose.connection.db;
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err);
  });

// Post 스키마 정의
const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  wdate: { type: Date, default: Date.now },
  writer: String,
});

const Post = mongoose.model("Post", postSchema);

// login
const checkUserSession = (req, res) => {
  if (req.session.user) {
    console.log("세션 유지");
    // res.json({ user: req.session.user });
    // res.sendFile(path.join(__dirname, "/build/index.html"));
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

app.post("/signup", async (req, res) => {
  console.log(req.body.userId);
  console.log(req.body.userPw);
  console.log(req.body.userGroup);
  console.log(req.body.userEmail);

  try {
    const collection = mydb.collection("account");
    await collection.insertOne({
      userId: req.body.userId,
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
