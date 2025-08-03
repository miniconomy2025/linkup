import { useEffect, useState } from 'react';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import SearchBox from '../../components/searchBox/SearchBox';
import SearchItem from '../../components/searchItem/SearchItem';
import "./SearchPage.css";
import { searchActor } from '../../api/requests/actor';

// TODO change to actor model to avoid mapping
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
        setUsers([]);
    };

    useEffect(() => {
    const fetchUsers = async () => {
        if (!searchQuery) return;
        setLoading(true);
        setError(null);
        try {
            const response = await searchActor({ query: searchQuery, page, limit: 5 });
            console.log(response)
            // assuming response: { results, total, page, limit, pages }
            const mappedUsers: User[] = response.results.map((actor: any, index: number) => ({
                userId: index, // or actor._id if available
                name: actor.name,
                username: actor.preferredUsername,
                followers: Math.floor(Math.random() * 500),
                avatar: actor.icon?.url || `https://i.pravatar.cc/150?u=${actor.id}`,
                visible: true,
                following: false,
            }));

            setUsers(mappedUsers);
            setTotalPages(response.pages);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
}, [searchQuery, page]);


    return (
        <PageLayout>
            <div className='search-container'>
                <SearchBox onSearch={handleSearch} />
                {loading && <p>Loading...</p>}
                {error && <p className='error'>{error}</p>}
                <div className='search-list'>
                    {users.map(user => (
                        <SearchItem 
                            id={user.userId}
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
                {totalPages > 1 && (
                    <div className="pagination">
                        <button className='button-secondary' onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Prev</button>
                        <span>Page {page} of {totalPages}</span>
                        <button className='button-secondary' onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};