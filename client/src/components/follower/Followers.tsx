import './Followers.css';
import { useNavigate } from 'react-router-dom';

interface FollowingProps {
    id: number;
    name: string;
    username: string;
    avatar: string;
};

const Followers: React.FC<FollowingProps> = ({ id, name, username, avatar }) => {

    const navigate = useNavigate();

    const handleUserClick = () => {
        navigate(`/profile/${id}`);
    };

    return (
        <div className="following-item-container">
            <div className='follow-request-item-info-container'>
                <img 
                    src={avatar} 
                    alt='avatar' 
                    width={40} 
                    height={40} 
                    className='follow-request-item-avatar'
                    onClick={handleUserClick}
                />
                <div >
                    <div>{name}</div>
                    <div>{username}</div>
                </div>
            </div>
            <div className='follow-request-actions'>
                <button className='button-secondary'>
                    Unfollow
                </button>
            </div>
        </div>
    );
};

export default Followers;
