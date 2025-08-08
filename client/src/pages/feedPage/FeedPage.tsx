import React, { useEffect, useRef, useState } from 'react';
import './FeedPage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { PostImage } from '../../components/postImage/PostImage';
import { useNavigate } from 'react-router-dom';
import { FcLikePlaceholder } from 'react-icons/fc';
import { FcLike } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { likePost } from '../../api/requests/activity';
import { getFeed } from '../../api/requests/posts';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';

const FeedPage: React.FC = () => {
    const videoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>({});
    const currentPlaying = useRef<HTMLVideoElement | null>(null);

    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const navigate = useNavigate();

    const handlePostClick = (postId: string) => {
        const encodedId = encodeURIComponent(postId);
        navigate(`/post/${encodedId}`);
    };

    const handleActorClick = (actorId: string) => {
        const encodedId = encodeURIComponent(actorId);
        navigate(`/profile/${encodedId}`);
    };

    const loadMorePosts = async () => {
        if (loadingRef.current || !hasMoreRef.current) return;

        setLoading(true);

        const currentPage = pageRef.current;
        const response = await getFeed({ page: currentPage, limit: 4 });

        if (response.length === 0) {
            setHasMore(false);
            hasMoreRef.current = false;
            setLoading(false);
            return;
        }

        setPosts((prev) => [...prev, ...response]);

        const nextPage = currentPage + 1;
        setPage(nextPage);
        pageRef.current = nextPage;

        setLoading(false);
    };

    
    // Load first posts
    useEffect(() => {
        try {
            setInitialLoading(true);
            getFeed({ page: 1, limit: 4 }).then(response => {
                setPosts(response);
                setPage(2); // next page would be 2
                setHasMore(response.length > 0);
            });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error('Failed loading posts')
        } finally {
            setInitialLoading(false);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target as HTMLVideoElement;

                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        if (currentPlaying.current && currentPlaying.current !== video) {
                            currentPlaying.current.pause();
                        }

                        video
                            .play()
                            .then(() => {
                                currentPlaying.current = video;
                            })
                            .catch((err) => {
                                console.warn('Autoplay failed:', err.message);
                            });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: [0.6] }
        );

        // Observe all videos
        Object.values(videoRefs.current).forEach((ref) => {
            const video = ref.current;
            if (video) observer.observe(video);
        });

        // Manually trigger first visible video (reliable loop)
        let animationFrameId: number;
        let attempts = 0;

        const detectFirstVisible = () => {
            attempts++;
            const visibleVideo = Object.values(videoRefs.current).find((ref) => {
                const video = ref.current;
                if (!video) return false;
                const rect = video.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                const ratio = visibleHeight / rect.height;
                return ratio > 0.6;
            })?.current;

            if (visibleVideo) {
                if (currentPlaying.current && currentPlaying.current !== visibleVideo) {
                    currentPlaying.current.pause();
                }

                visibleVideo
                    .play()
                    .then(() => {
                        currentPlaying.current = visibleVideo;
                    })
                    .catch((err) => {
                        console.warn('Manual autoplay failed:', err.message);
                    });
            } else if (attempts < 10) {
                animationFrameId = requestAnimationFrame(detectFirstVisible);
            }
        };

        animationFrameId = requestAnimationFrame(detectFirstVisible);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [posts]);

    const pageRef = useRef(page);
    const loadingRef = useRef(loading);
    const hasMoreRef = useRef(hasMore);

        useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 300;

            if (nearBottom && !loadingRef.current && hasMoreRef.current) {
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); 

    const notifySuccess = () => toast.success('Post liked Successfully!');
    const notifyError = () => toast.error('Error! Something went wrong.');

    const handlePostLike = async (postId: string) => {
        try {
            await likePost({ postId });
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, liked: true }
                        : post
                )
            );
            notifySuccess();
        } catch (err) {
            console.log(err)
            notifyError();
        };
    };

    if (initialLoading) return (
        <LoadingPage />
    );

    return (
        <PageLayout>
            <div className='feed-container'>
                <div className='post-container'>
                    {posts.map((post) => {

                        // Create ref for each video post if not exists
                        if (post.video && !videoRefs.current[post.id]) {
                            videoRefs.current[post.id] = React.createRef<HTMLVideoElement>();
                        };

                        return (
                            <div key={post.id} className='post-card'>
                                <div className='post-header' onClick={() => handleActorClick(post?.attributedTo)}>
                                    @{post?.attributedTo?.split('/')?.pop()}
                                </div>

                                {post.type === 'Image' && (
                                    <>
                                    <div className='post-media' onClick={() => handlePostClick(post.id)}>
                                        <PostImage src={post.url} alt='post' />
                                    </div>
                                    <div className='post-caption'>{post?.name}</div>
                                    </>
                                )}

                                {post.type === 'Video' && (
                                    <><div className='post-media'>
                                        <video
                                            ref={videoRefs.current[post._id]}
                                            src={post.url}
                                            className='post-video'
                                            muted
                                            playsInline
                                            loop
                                            controls
                                        />
                                    </div>
                                    <div className='post-caption'>{post?.name}</div>
                                    </>
                                )}
                                
                                {post.type === 'Note' && (
                                    <div className='post-media'>
                                        <div className='post-content-scrollable'>{post.content}</div>
                                    </div>
                                )}

                                <div className='post-actions'>
                                    <span className='post-action'>
                                        {post.liked === false ? (
                                            <FcLikePlaceholder 
                                                size={20} 
                                                onClick={() => handlePostLike(post.id)} 
                                                className='like-action' 
                                            /> 
                                        ): (
                                            <FcLike
                                                size={20} 
                                                className='like-action' 
                                            /> 
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {loading && <p>Loading more posts...</p>}
                    {!hasMore && <p style={{ textAlign: 'center' }}>{posts?.length > 0 ? 'No more posts' : 'No posts available'}</p>}
                </div>
                
            </div>
        </PageLayout>
    );
};

export default FeedPage;
