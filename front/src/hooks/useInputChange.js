import { useState } from "react";
// custom hook
// 이 훅은 formData와 handleChange라는 두 개의 속성을 가진 객체를 반환
// 단순 함수라 useCallback 사용 안해도 됨
const useInputChange = (init) => {
  const [formData, setFormData] = useState(init);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return { formData, handleChange };
};

export default useInputChange;
