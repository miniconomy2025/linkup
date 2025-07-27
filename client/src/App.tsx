import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import LoginPage from "./pages/loginPage/LoginPage";
import FeedPage from "./pages/feedPage/FeedPage";
// import CreatePostPage from "./pages/CreatePostPage";
// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
import Navbar from "./components/navbar/Navbar";
import { useAuth } from "./hooks/useAuth";
import "./App.css";
import { ProfilePage } from "./pages/profilePage/ProfilePage";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {isAuthenticated ? (
          <>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            {/* <Route path="/create" element={<CreatePostPage />} />
            
            <Route path="/settings" element={<SettingsPage />} /> */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;