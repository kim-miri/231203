import { useCallback } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useInputChange from "../hooks/useInputChange";

const Login = () => {
  // useInputChange 훅이 객체를 반환하기 때문에 이렇게 작성
  const { formData, handleChange } = useInputChange({
    userId: "",
    userPw: "",
  });

  const navigate = useNavigate();

  // const handleChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // }, []);

  const handleSubmit = useCallback(
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
      } catch (error) {
        alert("로그인 오류:", error.message);
      }

      console.log("전송 오류", formData);
    },
    [formData, navigate]
  );

  return (
    <Container className="mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="userPw"
            value={formData.userPw}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-grid d-md-flex justify-content-md-end mt-5">
          <Button type="submit" variant="primary">
            로그인
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
