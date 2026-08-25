import React from "react";
import { useNavigate } from "react-router";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>
      ⬅ Back
    </button>
  );
};

export default BackButton;