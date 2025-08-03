import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchItem.css';

interface SearchItemProps {
    id: number;
    name: string;
    username: string;
    avatar: string;
    followers: number;
    visible: boolean;
    following: boolean;
};

const SearchItem: React.FC<SearchItemProps> = ({ id, name, username, avatar, following }) => {

    const navigate = useNavigate();

    const handleActorClick = () => {
        navigate(`/profile/${id}`);
    };

    return (
        <div className="search-item-container">
            <img 
                src={avatar} 
                alt='avatar' 
                width={40} 
                height={40} 
                className='search-item-avatar'
                onClick={handleActorClick}
            />
            <div className='search-item-info-container'>
                <div>
                    <div>{name}</div>
                    <div>{username}</div>
                </div>
                <button className={following ? 'search-item-button' : 'search-item-button-active'}>
                    {following ? 'Following' : 'Follow'}
                </button>
            </div>
        </div>
    );
};

export default SearchItem;
