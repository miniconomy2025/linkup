import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/landingPage/LandingPage';
import { LoginPage } from './pages/loginPage/LoginPage';
import FeedPage from './pages/feedPage/FeedPage';
import { useAuth } from './hooks/useAuth';
import { ProfilePage } from './pages/profilePage/ProfilePage';
import { SearchPage } from './pages/searchPage/SearchPage';
import { NotificationsPage } from './pages/notificationsPage/NotificationsPage';
import { PostPage } from './pages/postPage/PostPage';
import { LoginSuccessPage } from './pages/loginSuccessPage/LoginSuccessPage';
import AuthenticatedLayout from './layouts/authenticatedLayout/AuthenticatedLayout';
import CreatePostPage from './pages/createPostPage/CreatePostPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                            <Route path='/profile/:username' element={<ProfilePage />} />
                            <Route path='/search' element={<SearchPage />} />
                            <Route path='/create' element={<CreatePostPage />} />
                            <Route path='/notifications' element={<NotificationsPage />} />
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