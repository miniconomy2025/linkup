import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginWithGoogle();
    navigate("/feed");
  };

  return (
    <div className="login-container">
      <h2>Sign In to MySocial</h2>
      <button className="google-button" onClick={handleLogin}>
        <img src={"https://img.icons8.com/color/48/000000/google-logo.png"} alt={"Google icon"} />
        Continue with Google
      </button>
    </div>
  );
};

export default LoginPage;
