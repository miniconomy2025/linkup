import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { getActorPosts, getActorProfile, getOtherActorPosts, getOtherActorProfile } from '../../api/requests/actor';
import { followActor, unfollowActor } from '../../api/requests/activity';

export const ProfilePage: React.FC = () => {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const currentActorId = user?.id ?? null;

    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id || 'me');

    const navigate = useNavigate();
    
    const handlePostClick = (postId: string) => {
        const encodedId = encodeURIComponent(postId);
        navigate(`/post/${encodedId}`);
    };

    const [loading, setLoading] = useState(false);

    const notifyError = () => toast.error('Error! Something went wrong.');

    const [profile, setProfile] = useState();
    const [posts, setPosts] = useState<any>();

    useEffect(() => {
        if (!decodedUrl && !currentActorId) return;
        const fetchActorProfile = async () => {
            setLoading(true);
            try {
                let response;
                let postsResponse;
                
                if (decodedUrl === 'me' || decodedUrl === currentActorId) {
                    response = await getActorProfile();
                    try {
                        postsResponse = await getActorPosts();
                    } catch {
                        console.warn('Failed to fetch your posts');
                    }
                } else {
                    response = await getOtherActorProfile({ url: decodedUrl });
                    try {
                        postsResponse = await getOtherActorPosts({ url: decodedUrl });
                    } catch {
                        console.warn('Failed to fetch other user posts');
                    }
                };     
                setProfile(response);
                if (postsResponse) setPosts(postsResponse);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                notifyError();
            } finally {
                setLoading(false);
            }
        };
        fetchActorProfile();
    }, [decodedUrl]);

    const [followLoading, setFollowLoading] = useState(false);

    const handleFollowActor = async () => {
        try {
            setFollowLoading(true);
            await followActor({ actorId: decodedUrl });
            const response = await getOtherActorProfile({ url: decodedUrl });
            setProfile(response);
            toast.success('Successfully followed actor!')
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            notifyError();
        } finally {
            setFollowLoading(false);
        };
    };

    const handleUnfollowActor = async () => {
        try {
            setFollowLoading(true);
            await unfollowActor({ actorId: decodedUrl });
            const response = await getOtherActorProfile({ url: decodedUrl });
            setProfile(response);
            toast.success('Successfully unfollowed actor!');
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
                            {decodedUrl !== 'me' && decodedUrl !== currentActorId && (profile?.isFollowing === false) && (
                                <button className='button-secondary' onClick={handleFollowActor} disabled={followLoading}>Follow</button>
                            )}
                            {decodedUrl !== 'me' && decodedUrl !== currentActorId && (profile?.isFollowing === true) && (
                                <button className='button-secondary' onClick={handleUnfollowActor} disabled={followLoading}>Unfollow</button>
                            )}
                        </div>
                        <div className='profile-top-info-numbers-container'>
                            <div>{profile?.posts || 0} Posts</div>
                            <Link to={decodedUrl !== 'me' && decodedUrl !== currentActorId ? `/followers/${encodeURIComponent(decodedUrl)}` : '/followers/me'} className='profile-link'>{profile?.followersCount || 0} followers</Link>
                            <Link to={decodedUrl !== 'me' && decodedUrl !== currentActorId ? `/following/${encodeURIComponent(decodedUrl)}` : '/following/me'} className='profile-link'>{profile?.followingCount || 0}  following</Link>
                        </div>
                    </div>
                </div>
                <div className='profile-posts-grid'>
                    {posts && posts.map(post => {
                        console.log(post)
                        return (
                        <div className='post-tile' onClick={() => handlePostClick(post.object.id)}>
                            {(post?.object?.type === 'Image' || post?.object?.attachment?.type === 'Image') && (
                                <img src={post.object?.url || post?.object?.attachment?.url} width={'100%'} height={'100%'}/>
                            )}
                            {(post?.object?.type === 'Video' || post?.object?.attachment?.type === 'Video') && (
                                <video
                                    src={post.object?.url}
                                    className='post-video'
                                    playsInline
                                    loop
                                    controls
                                />
                            )}
                            {(!post?.object?.attachment?.type && post?.object?.type === 'Note') && (
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