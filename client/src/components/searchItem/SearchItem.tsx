import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchItem.css';

interface SearchItemProps {
    id: number;
    name: string;
    // username: string;
    avatar: string;
    // followers: number;
    // visible: boolean;
    // following: boolean;
};

const SearchItem: React.FC<SearchItemProps> = ({ id, name, avatar }) => {

    const navigate = useNavigate();

    const handleActorClick = () => {
        const encodedId = encodeURIComponent(id);
        navigate(`/profile/${encodedId}`);
    };

    return (
        <div className="search-item-container" onClick={handleActorClick}>
            <img 
                src={avatar} 
                alt='avatar' 
                width={40} 
                height={40} 
                className='search-item-avatar'
            />
            <div className='search-item-info-container'>
                <div>
                    <div>{name}</div>
                </div>
                {/* <button className={following ? 'search-item-button' : 'search-item-button-active'}>
                    {following ? 'Following' : 'Follow'}
                </button> */}
            </div>
        </div>
    );
};

export default SearchItem;
