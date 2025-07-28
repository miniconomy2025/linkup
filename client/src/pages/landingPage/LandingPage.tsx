import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to LinkUp</h1>
        <p>Share your thoughts, moments, and media with the world.</p>
        <button onClick={() => navigate("/login")} className="landing-button">
          Get Started
        </button>
      </header>
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} LinkUp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;