import React, { useEffect, useState } from "react";
import "./FeedPage.css";
import { PageLayout } from "../../components/pageLayout/PageLayout";
import { PostImage } from "../../components/postImage/PostImage";
import { useNavigate } from "react-router-dom";

import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { FaRegComments } from "react-icons/fa";

// Simulate a paginated API for mock data
const allMockPosts = [
  // Repeat or extend with more mock items
  {
    id: "1",
    username: "alice",
    content: "What a beautiful day!",
    image: "https://th.bing.com/th/id/R.d22aafa9433efcc9ed4d9a7808c05a8a?rik=8tekSpiFRq3jhg&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f07%2fDownload-Free-Pictures-3840x2160.jpg",
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
    username: "carol",
    content: "Nature is healing 🌿",
    image: "https://picsum.photos/id/1018/400/300",
    likes: 30,
    comments: 7,
  },
  {
    id: "4",
    username: "dave",
    content: "Chillin' with coffee ☕",
    image: "https://picsum.photos/id/1015/400/300",
    likes: 12,
    comments: 1,
  },
  {
    id: "5",
    username: "eve",
    content: "Cloudy vibes ⛅",
    image: "https://picsum.photos/id/1016/400/300",
    likes: 14,
    comments: 3,
  },
  {
    id: "6",
    username: "frank",
    content: "Travel throwback 📸",
    image: "https://picsum.photos/id/1020/400/300",
    likes: 17,
    comments: 6,
  },
  {
    id: "7",
    username: "grace",
    content: "Sunset dreams 🌇",
    image: "https://picsum.photos/id/1011/400/300",
    likes: 22,
    comments: 4,
  },
  {
    id: "8",
    username: "henry",
    content: "Coding grind 👨‍💻",
    image: "https://picsum.photos/id/1010/400/300",
    likes: 40,
    comments: 9,
  },
];

const mockSuggested = [
    {
    id: "1",
    username: "Tebogo",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    followedBy: [
        "Chris_123", "Ron_321"
    ]
  },
  {
    id: "2",
    username: "Tiya",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    followedBy: [
        "Chris_123", "Ron_321"
    ]
  },
  {
    id: "3",
    username: "Ron",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    followedBy: [
        "Chris_123", "Ron_321"
    ]
  },
  {
    id: "4",
    username: "Rivo",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    followedBy: [
        "Chris_123", "Ron_321"
    ]
  },
  {
    id: "5",
    username: "Chris",
    avatar: "https://tse3.mm.bing.net/th/id/OIP.Sko8CQSOZhYy3u_kQB6J3QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    followedBy: [
        "Chris_123", "Ron_321"
    ]
  },
]

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
    setPosts(prev => [...prev, ...response.results]);
    setPage(prev => prev + 1);
    if (response.page >= response.pages) {
      setHasMore(false);
    }
    setLoading(false);
  };

  // Load first posts
  useEffect(() => {
    loadMorePosts();
  }, []);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts, page, hasMore]);

  return (
    <PageLayout>
      <div className="feed-container">
        <div className="post-container">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div 
                className="post-header" 
                onClick={() => handleActorClick(post.username)}>
                @{post.username}
                </div>
              <div
                className="post-image"
                onClick={() => handlePostClick(post.id)}
              >
                <PostImage src={post.image} alt="post" />
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-actions">
                <span className="post-action"><FcLikePlaceholder size={20} /> {post.likes}</span>
                <span className="post-action"><FaRegComments size={20} color={'#555'} /> {post.comments}</span>
              </div>
            </div>
          ))}
          {loading && <p>Loading more posts...</p>}
          {!hasMore && <p style={{ textAlign: "center" }}>No more posts</p>}
        </div>
        <div className="suggested-container">
        <div className="suggested-title">Suggested for you</div>
          {mockSuggested.map(suggested => (
              <div className="suggested-info-container">
                  <img src={suggested.avatar} width={40} height={40} alt="avatar" className="suggested-avatar" />
                  <div className="suggested-name-container">
                      <div className="suggested-name">{suggested.username}</div>
                  <div className="suggested-followed-by">Followed by {suggested.followedBy[0]} + {suggested.followedBy.length}</div>
                  </div>
                  
                  <button className="suggested-follow">Follow</button>
              </div>
          ))}
          
        </div>
      </div>
    </PageLayout>
  );
};

export default FeedPage;
