import { useCallback, useState } from "react";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [msg, setMsg] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    userPw: "",
    userGroup: "",
    userEmail: "",
  });
  const { userId, userPw, userGroup, userEmail } = formData;

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const res = await axios.post("/signup", formData);

      if (res.status !== 200) {
        throw new Error("회원가입 실패");
      }

      alert("회원가입 성공");
      // 회원가입 성공 시 로그인 페이지로 이동하도록 설정
      navigate("/");
    } catch (err) {
      setMsg(err.message);
    }

    console.log("Form submitted:", formData);
  };

  return (
    <Container className="mt-3">
      <Form onSubmit={handleSubmit}>
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

        <Form.Group className="mb-3">
          <Form.Label>소속</Form.Label>
          <Form.Control
            type="text"
            placeholder="소속을 입력하세요"
            name="userGroup"
            value={userGroup}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            placeholder="이메일을 입력하세요"
            name="userEmail"
            value={userEmail}
            onChange={handleChange}
          />
        </Form.Group>

        {msg && <Alert variant="danger">{msg}</Alert>}

        <Button variant="primary" type="submit">
          회원가입
        </Button>
      </Form>
    </Container>
  );
};

export default SignUp;
