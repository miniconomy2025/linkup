import './FollowRequest.css';
import { useNavigate } from 'react-router-dom';

interface FollowRequestProps {
    id: number;
    name: string;
    username: string;
    avatar: string;
};

const FollowRequest: React.FC<FollowRequestProps> = ({ id, name, username, avatar }) => {

    const navigate = useNavigate();

    const handleUserClick = () => {
        navigate(`/profile/${id}`);
    };

    return (
        <div className="follow-request-item-container">
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
                <button className='follow-request-item-button'>
                    Reject
                </button>
                <button className={'follow-request-item-button-active'}>
                    Accept
                </button>
            </div>
        </div>
    );
};

export default FollowRequest;
