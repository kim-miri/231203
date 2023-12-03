import axios from "axios";
import { useState, useCallback } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useInputChange from "../hooks/useInputChange";

const PostWrite = () => {
  const navigator = useNavigate();
  const currentDate = new Date().toISOString(); // 현재 날짜를 yyyy-mm-dd 형식으로 반환
  const [form, setForm] = useState({
    title: "",
    content: "",
    writer: "green",
    wdate: currentDate,
    //new Date().toLocaleString(), 현재 날짜를 문자열형식으로 설정 2023. 11. 5. 오후 5:30:03 이렇게 나옴. 하지만 이건 쓸 수 없음. server.js 에서 정렬을 위해 Date 타입으로 설정했으니 직접 new Date() 객체를 사용하거나 .toISOString()을 써야 함
  });

  const { title, content, writer, wdate } = form;
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = useCallback(async () => {
    if (!title || !content) {
      alert("제목이나 내용을 입력하세요");
    } else {
      if (window.confirm("위 내용을 저장하시겠습니까?")) {
        await axios.post("/posts/write", form);
        navigator("/posts");
      }
    }
  }, [title, content, form, navigator]);

  const handleReset = () => {
    setForm({
      ...form,
      title: "",
      content: "",
      writer: "green",
      wdate: currentDate,
    });
  };

  return (
    <Row className="my-5">
      <Col className="p-5">
        <h2 className="text-center my-5">글쓰기</h2>
        <Form>
          <Form.Control
            placeholder="제목을 입력하세요."
            className="my-3"
            name="title"
            value={title}
            onChange={onChange}
          />
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="내용을 입력하세요."
            className="my-3"
            name="content"
            value={content}
            onChange={onChange}
          />
          <Form.Group controlId="writer">
            <Form.Label>작성자</Form.Label>
            <Form.Control
              type="text"
              name="writer"
              value={writer}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group controlId="wdate">
            <Form.Label>작성일</Form.Label>
            <Form.Control
              type="text"
              name="wdate"
              value={new Date(wdate).toLocaleDateString("ko-KR", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
              })}
              onChange={onChange}
            />
          </Form.Group>
          <div className="text-center mt-3">
            <Button className="mx-2 px-3 btn-sm" onClick={onSubmit}>
              저장
            </Button>
            <Button
              className="mx-2 px-3 btn-sm"
              onClick={handleReset}
              variant="secondary"
            >
              취소
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default PostWrite;
