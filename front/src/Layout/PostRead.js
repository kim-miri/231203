import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostRead = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigator = useNavigate();
  const [form, setForm] = useState({
    id: id,
    title: "",
    content: "",
    writer: "",
    wdate: "",
  });
  const { title, content, writer, wdate } = form;

  const getData = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`/posts/read/${id}`);
      setForm({ ...result.data });
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const onDelete = async () => {
    if (window.confirm(`${title} 게시글을 삭제하시겠습니까??`)) {
      try {
        await axios.post(`/posts/delete/${id}`);
        navigator("/posts");
      } catch (error) {
        console.error("데이터를 삭제하는 중 오류 발생:", error);
      }
    }
  };

  const onBack = () => {
    navigator(-1);
  };

  const formattedDate = useMemo(() => {
    return new Date(wdate).toLocaleDateString("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
  }, [wdate]);

  return loading ? (
    <h1 className="my-5 text-center">로딩중입니다......</h1>
  ) : (
    <Row className="my-5">
      <Col className="px-5">
        <h1 className="my-5 text-center">게시글정보</h1>
        <div className="text-end my-2">
          <Button className="btn-sm" onClick={onBack}>
            뒤로가기
          </Button>
          <Link to={`/posts/update/${id}`}>
            <Button className="btn-sm mx-2">수정</Button>
          </Link>
          <Button className="btn-sm" variant="danger" onClick={onDelete}>
            삭제
          </Button>
        </div>
        <Card>
          <Card.Body>
            <h5>{title}</h5>
            <hr />
            <div>{content}</div>
          </Card.Body>
          <Card.Footer>
            Created on
            {/* {new Date(wdate).toLocaleDateString("ko-KR", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: false,
            })} */}
            {formattedDate}
            by {writer}
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default PostRead;
