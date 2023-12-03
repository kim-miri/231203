import axios from "axios";
import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const PostList = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const param_page = search.get("page");
  const page = param_page === null ? 1 : parseInt(param_page);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const callAPI = async () => {
    setLoading(true);

    try {
      const result = await axios.get(`/posts?page=${page}`);
      const listNo = (page - 1) * 10 + 1;
      const postsNo = result.data.docs.map((post, index) => ({
        ...post,
        no: listNo + index,
      }));
      setPosts(postsNo);

      // 전체 데이터 수를 기반으로 전체 페이지 수 계산
      setTotalPages(result.data.totalPages); // 서버에서 전달하는 totalPages 사용
    } catch (err) {
      console.error(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callAPI();
  }, [page]);

  // if (loading) return <h1 className="my-5 text-center">로딩중입니다......</h1>;

  return (
    <Row className="my-5">
      <Col className="mx-3">
        <h2 className="text-center">게시글</h2>
        <div className="text-end mb-5">
          <Link to="/posts/write">
            <Button>글쓰기</Button>
          </Link>
        </div>
        {loading ? (
          <h1 className="my-5 text-center">로딩중입니다......</h1>
        ) : (
          <Table>
            <thead>
              <tr>
                <td>No</td>
                <td>Title</td>
                <td>Contents</td>
                <td>Writer</td>
                <td>Date</td>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.no}</td>
                  <td>
                    <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  </td>
                  <td>{post.content}</td>
                  <td>{post.writer}</td>
                  {/* <td>{post.wdate}</td> */}
                  <td>
                    {new Date(post.wdate).toLocaleDateString("ko-KR", {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
      <div className="text-center">
        {page > 1 && (
          <Link to={`/posts?page=${page - 1}`}>
            <Button className="mx-2">이전</Button>
          </Link>
        )}
        <span className="mx-2">
          {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link to={`/posts?page=${page + 1}`}>
            <Button className="mx-2">다음</Button>
          </Link>
        )}
      </div>
    </Row>
  );
};

export default PostList;
