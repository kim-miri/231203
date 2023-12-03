import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Layout/Home";
import PostList from "./Layout/PostList";
import PostWrite from "./Layout/PostWrite";
import PostRead from "./Layout/PostRead";
import PostUpdate from "./Layout/PostUpdate";
import SignUp from "./Layout/SignUp";
import Login from "./Layout/Login";
import axios from "axios";

const App = () => {
  const navigator = useNavigate();
  const [serverMsg, setServerMsg] = useState("");

  useEffect(() => {
    axios
      .get("/") // 서버 주소에 맞게 수정
      .then((res) => {
        setServerMsg(res.data); //서버와의 통신 결과를 처리하기 위해 서버 응답을 상태로 저장하고 활용
        console.log(res.data);
      })
      .catch((error) => {
        console.error("서버 요청 에러:", error);
      });
  }, []);

  // const onClickHome = (e) => {
  //   e.preventDefault();
  //   navigator("/");
  // };
  // const onClickPosts = (e) => {
  //   e.preventDefault();
  //   navigator("/posts");
  // };
  // const onClickJoin = (e) => {
  //   e.preventDefault();
  //   navigator("/signup");
  // };

  // const onClickLog = (e) => {
  //   e.preventDefault();
  //   navigator("/login");
  // };
  const handleClick = (path) => (e) => {
    e.preventDefault();
    navigator(path);
  };

  return (
    <div>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#" onClick={handleClick("/")}>
            React
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" onClick={handleClick("/posts")}>
                게시판
              </Nav.Link>
              <Nav.Link href="#" onClick={handleClick("/signup")}>
                회원가입
              </Nav.Link>
              <Nav.Link href="#" onClick={handleClick("/login")}>
                로그인
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/write" element={<PostWrite />} />
        <Route path="/posts/:id" element={<PostRead />} />
        <Route path="/posts/update/:id" element={<PostUpdate />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
