import { useParams } from 'react-router-dom';
import Followers from '../../components/follower/Followers';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import './FollowersPage.css';
import { useEffect, useState } from 'react';
import { getCurrentActorFollowers } from '../../api/requests/actor';
import { toast } from 'react-toastify';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';

export const FollowersPage: React.FC = () => {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const currentActorId = user?.id ?? null;
    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id || '');
    const [loading, setLoading] = useState(false);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const fetchActorFollowers = async () => {
            setLoading(true);
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let response: any;
                
                if (decodedUrl !== 'me' && decodedUrl !== currentActorId) {
                    // Load other users following
                } else {
                    response = await getCurrentActorFollowers();
                    console.log(response)
                };
                setFollowers(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                toast.error('Unable to load followers!')
            } finally {
                setLoading(false);
            }
        };
        fetchActorFollowers();
    }, [decodedUrl, currentActorId]);

    if (loading) return (
        <LoadingPage />
    );

    return (
        <PageLayout>
            <div className='notifications-container'>
                <h1 className='section-title'>Followers</h1>
                <div className='follow-requests-container'>
                    {followers.map(actor => (
                        <Followers
                            id={actor.id} 
                            name={actor.name} 
                            username={actor.username} 
                            avatar={actor.avatar} 
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};