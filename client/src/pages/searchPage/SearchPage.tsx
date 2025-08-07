import { useEffect, useState } from 'react';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import SearchBox from '../../components/searchBox/SearchBox';
import SearchItem from '../../components/searchItem/SearchItem';
import './SearchPage.css';
import { searchActor2 } from '../../api/requests/actor';
import { toast } from 'react-toastify';

export const SearchPage = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [actor, setActor] = useState();
    const [loading, setLoading] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setActor(undefined);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery) return;
            setLoading(true);
            try {
                const response = await searchActor2({ query: searchQuery });
                setActor(response);
            } catch (err: any) {
                toast.error('Error searching!');
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
                <div className='search-list'>
                    {actor && <SearchItem 
                        id={actor?.id}
                        name={actor?.name}
                        avatar={actor?.icon}
                    />}
                </div>
            </div>
        </PageLayout>
    );
};