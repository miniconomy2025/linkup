import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import FeedPage from './pages/feedPage/FeedPage';
import { useAuth } from './hooks/useAuth';
import { ProfilePage } from './pages/profilePage/ProfilePage';
import { SearchPage } from './pages/searchPage/SearchPage';
import { PostPage } from './pages/postPage/PostPage';
import { LoginSuccessPage } from './pages/loginSuccessPage/LoginSuccessPage';
import AuthenticatedLayout from './layouts/authenticatedLayout/AuthenticatedLayout';
import CreatePostPage from './pages/createPostPage/CreatePostPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FollowingPage } from './pages/followingPage/FollowingPage';
import { FollowersPage } from './pages/followersPage/FollowersPage';

const App = () => {

    const { isAuthenticated } = useAuth();

    return (
        <>
            <ToastContainer 
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Router>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/login/success' element={<LoginSuccessPage />} />
                    {isAuthenticated ? (
                        <Route element={<AuthenticatedLayout />}>
                            <Route path='/feed' element={<FeedPage />} />
                            <Route path='/profile/:id' element={<ProfilePage />} />
                            <Route path='/search' element={<SearchPage />} />
                            <Route path='/create' element={<CreatePostPage />} />
                            <Route path='/following/:id' element={<FollowingPage />} />
                            <Route path='/followers/:id' element={<FollowersPage />} />
                            <Route path='/post/:id' element={<PostPage />} />
                        </Route>
                    ) : (
                        <Route path='*' element={<Navigate to='/' />} />
                    )}
                </Routes>
            </Router>
        </>
    );
};

export default App;