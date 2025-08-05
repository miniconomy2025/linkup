import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { getActorPosts, getActorProfile } from '../../api/requests/actor';
import type { Actor } from '../../types/types';
import { followActor } from '../../api/requests/activity';

export const ProfilePage: React.FC = () => {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const currentActorId = user?.id ?? null;

    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id || '');

    const navigate = useNavigate();
    
    const handlePostClick = (postId: string) => {
        const encodedId = encodeURIComponent(postId);
        navigate(`/post/${encodedId}`);
    };

    const [loading, setLoading] = useState(false);

    const notifyError = () => toast.error('Error! Something went wrong.');

    const [profile, setProfile] = useState<Actor>();
    const [posts, setPosts] = useState<any>([]);

    useEffect(() => {
        const fetchActorProfile = async () => {
            setLoading(true);
            try {
                let response;
                let postsResponse;
                
                if (decodedUrl === 'me' || decodedUrl === currentActorId) {
                    response = await getActorProfile();
                    postsResponse = await getActorPosts();
                    
                    
                } else {
                    // console.log("TODO get other user")
                };
                
                console.log(response)
                console.log(postsResponse)
                setPosts(postsResponse);
                setProfile(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                notifyError();
            } finally {
                setLoading(false);
            }
        };
        fetchActorProfile();
    }, [decodedUrl, currentActorId]);

    const [followLoading, setFollowLoading] = useState(false);

    const handleFollowActor = async () => {
        try {
            setFollowLoading(true);
            await followActor({ actorId: decodedUrl });
            toast.success('Successfully followed actor!')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            notifyError();
        } finally {
            setFollowLoading(false);
        };
    };

    if (loading) return (
        <LoadingPage />
    );

    return (
        <PageLayout>
            <div className='profile-container'>
                <div className='profile-top-container'>
                    {profile?.icon?.url ? <img src={profile.icon.url} alt="avatar" width={120} height={120} className="sidebar-avatar" /> : <RxAvatar size={200} />}
                    <div className='profile-top-info-container'>
                        <div className='profile-top-info-edit-container'>
                            <div className='profile-top-info-username'>{profile?.name}</div>
                            {decodedUrl !== 'me' && decodedUrl !== currentActorId && (
                                <button className='button-secondary' onClick={handleFollowActor} disabled={followLoading}>Follow</button>
                            )}
                        </div>
                        <div className='profile-top-info-numbers-container'>
                            <div>{profile?.posts || 0} Posts</div>
                            <Link to={decodedUrl !== 'me' && decodedUrl !== currentActorId ? `/followers/${decodedUrl}` : '/followers/me'} className='profile-link'>{profile?.followers || 0} followers</Link>
                            <Link to={decodedUrl !== 'me' && decodedUrl !== currentActorId ? `/following/${decodedUrl}` : '/following/me'} className='profile-link'>{profile?.following || 0}  following</Link>
                        </div>
                    </div>
                </div>
                <div className='profile-posts-grid'>
                    {posts && posts.map(post => {
                        return (
                        <div className='post-tile' onClick={() => handlePostClick(post.id)}>
                            {post?.object?.type === 'Image' && (
                                <img src={post.object?.url} width={'100%'} height={'100%'}/>
                            )}
                            {post?.object?.type === 'Video' && (
                                <video
                                    src={post.object?.url}
                                    className='post-video'
                                    playsInline
                                    loop
                                    controls
                                />
                            )}
                            {post?.object?.type === 'Note' && (
                                <div className='post-media-note'>
                                    <div className='post-content-scrollable'>{post.object.content}</div>
                                </div>
                            )}
                        </div>
                    ) })}
                </div>
            </div>
        </PageLayout>
    );
};