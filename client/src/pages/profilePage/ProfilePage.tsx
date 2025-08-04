import React from 'react';
import './ProfilePage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../hooks/useAuth';
import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';

const mockPosts = [
  {
    id: "1",
    username: "alice",
    content: "What a beautiful day!",
    image: "https://th.bing.com/th/id/R.d22aafa9433efcc9ed4d9a7808c05a8a?rik=8tekSpiFRq3jhg&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f07%2fDownload-Free-Pictures-3840x2160.jpg&ehk=ZfChm9icVrVUFSnPnWsPaf7qOQGA9l1qj0BRZx4lTzE%3d&risl=&pid=ImgRaw&r=0",
    likes: 10,
    comments: 2,
  },
  {
    id: "2",
    username: "bob",
    content: "Check out my new setup 🎮",
    image: "https://my.alfred.edu/zoom/_images/foster-lake.jpg",
    likes: 25,
    comments: 5,
  },
  {
    id: "3",
    username: "bob",
    content: "Check out my new setup 🎮",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 25,
    comments: 5,
  },
];

export const ProfilePage: React.FC = () => {

    const { user } = useAuth();

    const navigate = useNavigate();
    
    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    return (
        <PageLayout>
            <div className='profile-container'>
                <div className='profile-top-container'>
                    {user?.avatar ? <img src={user.avatar} alt="avatar" width={200} height={200} className="sidebar-avatar" /> : <RxAvatar size={200} />}
                    <div className='profile-top-info-container'>
                        <div className='profile-top-info-edit-container'>
                            <div className='profile-top-info-username'>chrismchardy123</div>
                            <button className='profile-top-info-edit-button'>Edit profile</button>
                        </div>
                        <div className='profile-top-info-numbers-container'>
                            <div>7 Posts</div>
                            <Link to="/followers">342 followers</Link>
                            <Link to="/following">251 following</Link>
                        </div>
                        <div className='profile-top-info-name'>Name</div>
                    </div>
                </div>
                <div className='profile-posts-grid'>
                    {mockPosts.map((post, i) => (
                        <div key={i} className='post-tile' onClick={() => handlePostClick(post.id)}>
                            {post.image && (
                                <img src={post.image} width={'100%'} height={'100%'}/>
                            )}
                            {post.video && (
                                <video
                                    src={post.video}
                                    className='post-video'
                                    playsInline
                                    loop
                                    controls
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};