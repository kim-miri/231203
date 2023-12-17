import { useState, useCallback } from "react";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
  });
  const { userId, userPw } = formData;

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    },
    [formData]
  );

  // const handleLogin = useCallback(
  //   (e) => {
  //     e.preventDefault();

  //     const storageUserList = JSON.parse(localStorage.getItem("user"));
  //     // 아이디와 비밀번호를 비교
  //     const checkUser = storageUserList.find(
  //       (list) =>
  //         list.userId === formData.userId && list.userPw === formData.userPw
  //     );

  //     if (checkUser) {
  //       localStorage.setItem("user", JSON.stringify(checkUser));
  //       navigate("/"); // 로그인이 되면 홈으로 이동
  //     } else {
  //       setErrMsg("아이디나 비밀번호가 틀렸습니다");
  //     }
  //   },
  //   [formData, navigate]
  // );

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        // 로그인 로직
        const res = await axios.post("/login", formData);

        if (res.data.error) {
          throw new Error("로그인 실패", res.data.error);
        }

        alert("로그인 성공:", res.data);
        navigate("/");
      } catch (err) {
        console.log(err.message);
        setErrMsg("아이디나 비밀번호가 틀렸습니다");
      }

      console.log("Form submitted:", formData);
    },
    [formData, navigate]
  );

  return (
    <Container className="mt-3">
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            placeholder="아이디를 입력하세요"
            name="userId"
            value={userId}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호를 입력하세요"
            name="userPw"
            value={userPw}
            onChange={handleChange}
          />
        </Form.Group>

        {errMsg && <Alert variant="danger">{errMsg}</Alert>}

        <Button variant="primary" type="submit">
          로그인
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
