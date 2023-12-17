import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginButton = () => (
  <Link to="/login">
    <Button variant="warning">로그인</Button>
  </Link>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const storageUser = localStorage.getItem("user");

  //   if (storageUser) {
  //     setUser(JSON.parse(storageUser));
  //   }
  // }, []);

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("오류:", err);
      });
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   setUser(null);
  //   navigate("/");
  // };

  const handleLogout = () => {
    axios
      .get("/logout")
      .then((res) => {
        if (res.data.user === null) {
          setUser(null);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("오류:", err);
      });
  };

  return (
    <Container className="mt-3">
      <h2>Home</h2>
      {user ? (
        <div>
          <h3>환영합니다 {user.userId}님</h3>
          <Button variant="primary" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      ) : (
        <div>
          <h3>로그인 해 주세요</h3>
          <LoginButton />

          <Link to="/signup" style={{ marginLeft: 10 }}>
            <Button variant="success">회원가입</Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Home;
