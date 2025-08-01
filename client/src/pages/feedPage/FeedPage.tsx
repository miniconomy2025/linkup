import React, { useEffect, useRef, useState } from 'react';
import './FeedPage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { PostImage } from '../../components/postImage/PostImage';
import { useNavigate } from 'react-router-dom';

import { FcLikePlaceholder } from 'react-icons/fc';
import { FaRegComments } from 'react-icons/fa';

// Simulate a paginated API for mock data
const allMockPosts = [
    {
        id: '1',
        username: 'alice',
        content: 'What a beautiful day!',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        likes: 10,
        comments: 2,
    },
    {
        id: '2',
        username: 'bob',
        content: 'Check out my new setup 🎮',
        image: 'https://my.alfred.edu/zoom/_images/foster-lake.jpg',
        likes: 25,
        comments: 5,
    },
    {
        id: '3',
        username: 'carol',
        content: 'Nature is healing 🌿',
        image: 'https://picsum.photos/id/1018/400/300',
        likes: 30,
        comments: 7,
    },
    {
        id: '4',
        username: 'dave',
        content: "Chillin' with coffee ☕",
        text: 'In the vast and ever-evolving landscape of technology, innovation drives the pace at which societies transform and adapt to new challenges and opportunities. From the earliest days of mechanical inventions to the rise of digital computing, human creativity has consistently pushed boundaries, leading to breakthroughs that have reshaped industries and daily life. Today, artificial intelligence and machine learning stand at the forefront of this revolution, enabling machines to process vast amounts of data, recognize patterns, and even make decisions with a degree of autonomy that was once considered the realm of science fiction. This technological progress has brought about profound changes, from healthcare advancements that personalize treatments based on genetic information to autonomous vehicles promising to redefine transportation safety and efficiency. However, as technology becomes more integrated into every aspect of human experience, ethical considerations grow increasingly complex. Questions about data privacy, algorithmic bias, and the impact of automation on employment demand careful thought and responsible stewardship to ensure that innovation benefits all members of society. Amidst these challenges, education remains a critical pillar, equipping individuals with the skills and knowledge to navigate a rapidly changing world and participate meaningfully in shaping the future. Ultimately, the story of technology is a story of human ingenuity and resilience, reflecting our enduring quest to understand, improve, and connect with the world around us.',
        likes: 12,
        comments: 1,
    },
    {
        id: '5',
        username: 'eve',
        content: 'Cloudy vibes ⛅',
        image: 'https://picsum.photos/id/1016/400/300',
        likes: 14,
        comments: 3,
    },
    {
        id: '6',
        username: 'frank',
        content: 'Travel throwback 📸',
        image: 'https://picsum.photos/id/1020/400/300',
        likes: 17,
        comments: 6,
    },
    {
        id: '7',
        username: 'grace',
        content: 'Sunset dreams 🌇',
        image: 'https://picsum.photos/id/1011/400/300',
        likes: 22,
        comments: 4,
    },
    {
        id: '8',
        username: 'henry',
        content: 'Coding grind 👨‍💻',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        likes: 40,
        comments: 9,
    },
];

const fetchMockPosts = async (page: number, limit: number) => {
    const start = (page - 1) * limit;
    const end = page * limit;
    const results = allMockPosts.slice(start, end);
    const total = allMockPosts.length;
    return {
        results,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    };
};

const FeedPage: React.FC = () => {
    const videoRefs = useRef<Record<string, React.RefObject<HTMLVideoElement>>>({});
    const currentPlaying = useRef<HTMLVideoElement | null>(null);

    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handlePostClick = (postId: string) => {
        navigate(`/post/${postId}`);
    };

    const handleActorClick = (actorId: string) => {
        navigate(`/profile/${actorId}`);
    };

    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const response = await fetchMockPosts(page, 2);

        setPosts((prev) => {
            // Create a set of existing IDs for quick lookup
            const existingIds = new Set(prev.map(post => post.id));
            // Filter out duplicates from new results
            const newPosts = response.results.filter(post => !existingIds.has(post.id));
            return [...prev, ...newPosts];
        });

        setPage((prev) => prev + 1);
        if (response.page >= response.pages) {
            setHasMore(false);
        }
        setLoading(false);
    };

    // Load first posts
    useEffect(() => {
        // load first 4 posts (2 pages)
        fetchMockPosts(1, 4).then(response => {
            setPosts(response.results);
            setPage(2); // next page would be 2
            setHasMore(response.page < response.pages);
        });
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

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 300;
            if (nearBottom) {
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [posts, page, hasMore]);

    return (
        <PageLayout>
            <div className='feed-container'>
                <div className='post-container'>
                    {posts.map((post) => {
                        // Create ref for each video post if not exists
                        if (post.video && !videoRefs.current[post.id]) {
                            videoRefs.current[post.id] = React.createRef<HTMLVideoElement>();
                        }

                        console.log(post)

                        return (
                            <div key={post.id} className='post-card'>
                                <div className='post-header' onClick={() => handleActorClick(post.username)}>
                                    @{post.username}
                                </div>

                                {post.image && (
                                    <div className='post-media' onClick={() => handlePostClick(post.id)}>
                                        <PostImage src={post.image} alt='post' />
                                    </div>
                                )}

                                {post.video && (
                                    <div className='post-media'>
                                        <video
                                            ref={videoRefs.current[post.id]}
                                            src={post.video}
                                            className='post-video'
                                            muted
                                            playsInline
                                            loop
                                            controls
                                        />
                                    </div>
                                )}
                                
                                {post.text && (
                                    <div className='post-media'>
                                        <div className='post-content-scrollable'>{post.text}</div>
                                    </div>
                                )}

                                <div className='post-caption'>{post.content}</div>

                                <div className='post-actions'>
                                    <span className='post-action'>
                                        <FcLikePlaceholder size={20} /> {post.likes}
                                    </span>
                                    <span className='post-action'>
                                        <FaRegComments size={20} color={'#555'} /> {post.comments}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {loading && <p>Loading more posts...</p>}
                    {!hasMore && <p style={{ textAlign: 'center' }}>No more posts</p>}
                </div>
                
            </div>
        </PageLayout>
    );
};

export default FeedPage;
