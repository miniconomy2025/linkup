import React, { useState } from 'react';
import './SearchBox.css';
import { FiSearch } from 'react-icons/fi';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <span className="search-icon"><FiSearch size={16} onClick={() => onSearch(query)}/></span>
    </div>
  );
};

export default SearchBox;
