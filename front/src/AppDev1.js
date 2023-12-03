import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [serverMessage, setServerMessage] = useState("");
  useEffect(() => {
    // 서버로 요청 보내기
    axios
      .get("http://localhost:8080")
      .then((res) => {
        setServerMessage(res.data);
      })
      .catch((error) => {
        console.error("서버 요청 에러:", error);
      });
  }, []);

  return (
    <div>
      <h1>프론트엔드 첫 페이지</h1>
      <p>백엔드에서 받은 메시지: {serverMessage}</p>
    </div>
  );
};

export default App;
