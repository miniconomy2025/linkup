import React from 'react';
import './SearchItem.css';
import { FaLock } from "react-icons/fa";

interface SearchItemProps {
    name: string;
    username: string;
    avatar: string;
    followers: number;
    visible: boolean;
    following: boolean;
};

const SearchItem: React.FC<SearchItemProps> = ({ name, username, avatar, followers, visible, following }) => {
  return (
    <div className="search-item-container">
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
                <div>{username}</div>
                <div>
                    <span>{followers} Followers</span>
                    {!visible && <span>• <FaLock size={12} /> Private</span>}
                </div>
            </div>
            <button className={following ? 'search-item-button' : 'search-item-button-active'}>
                {following ? 'Following' : !visible ? 'Request' : 'Follow'}
            </button>
        </div>
    </div>
  );
};

export default SearchItem;
