import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

const LoginButton = () => (
  <Link to="/login">
    <Button variant="warning">로그인</Button>
  </Link>
);

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/login");
        setUser(res.data.user);
      } catch (error) {
        console.error("오류:", error);
      }
    };

    getData();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const res = await axios.get("/logout");
      if (res.data.user === null) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("오류:", error);
    }
  }, [navigate]);

  return (
    <Container className="mt-5">
      <h1>Home</h1>
      {user ? (
        <div>
          <h3>반갑습니다. {user.userId}님</h3>
          <Button variant="primary" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      ) : (
        <div>
          <h3>로그인 해주세요.</h3>
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
