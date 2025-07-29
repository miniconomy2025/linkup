import { useEffect, useState } from 'react';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import SearchBox from '../../components/searchBox/SearchBox';
import SearchItem from '../../components/searchItem/SearchItem';
import "./SearchPage.css";
import axios from 'axios';

const mockUsers = [
    {
        userId: 1,
        name: 'Chris',
        username: 'chrismchardy123',
        followers: 126,
        avatar: 'https://i.pravatar.cc/150?u=1',
        visible: false,
        following: true
    },
    {
        userId: 2,
        name: 'Chris',
        username: 'chrismchardy123',
        followers: 126,
        avatar: 'https://i.pravatar.cc/150?u=1',
        visible: true,
        following: false
    },
     {
        userId: 3,
        name: 'Chris',
        username: 'chrismchardy123',
        followers: 126,
        avatar: 'https://i.pravatar.cc/150?u=1',
        visible: false,
        following: false
    }
]

type User = {
    userId: number;
    name: string;
    username: string;
    followers: number;
    avatar: string;
    visible: boolean;
    following: boolean;
};


export const SearchPage = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setUsers([]);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery) return;
            setLoading(true);
            setError(null);
            try {
                // simulate API call
                const response = await new Promise<{ data: User[] }>((resolve) => {
                    setTimeout(() => {
                        resolve({ data: mockUsers });
                    }, 500); // simulate 500ms
                });
                // const response = await axios.get(`/api/search`, {
                //     params: { query: searchQuery }
                // });
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [searchQuery]);


    return (
        <PageLayout>
            <div className='search-container'>
                <SearchBox onSearch={handleSearch} />
                {loading && <p>Loading...</p>}
                {error && <p className='error'>{error}</p>}
                <div className='search-list'>
                    {users.map(user => (
                        <SearchItem 
                            key={user.userId}
                            name={user.name}
                            username={user.username}
                            followers={user.followers}
                            avatar={user.avatar}
                            visible={user.visible}
                            following={user.following}
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};