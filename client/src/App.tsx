import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import LoginPage from "./pages/loginPage/LoginPage";
import FeedPage from "./pages/feedPage/FeedPage";
// import CreatePostPage from "./pages/CreatePostPa
import Navbar from "./components/navbar/Navbar";
import { useAuth } from "./hooks/useAuth";
import { ProfilePage } from "./pages/profilePage/ProfilePage";
import { SearchPage } from "./pages/searchPage/SearchPage";
import { NotificationsPage } from "./pages/notificationsPage/NotificationsPage";
import { PostPage } from "./pages/postPage/PostPage";

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
            <Route path='/search' element={<SearchPage />} />
            <Route path='/notifications' element={<NotificationsPage />} />
            <Route path='/post/:id' element={<PostPage />} />
            {/* <Route path="/create" element={<CreatePostPage />} /> */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;