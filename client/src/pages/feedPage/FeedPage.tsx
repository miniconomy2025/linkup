import React from "react";
import "./FeedPage.css";

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
    image: "https://my.alfred.edu/zoom/_images/foster-lake.jpg",
    likes: 25,
    comments: 5,
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

const FeedPage: React.FC = () => {
  return (
    <div className="feed-container">
    <div className="post-container">
      {mockPosts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">@{post.username}</div>
          <div className="post-image">
            <img src={post.image} alt="post" />
          </div>
          <div className="post-content">{post.content}</div>
          <div className="post-actions">
            <span>❤️ {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      ))}
      
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
  );
};

export default FeedPage;
