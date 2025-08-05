import { useParams } from 'react-router-dom';
import Following from '../../components/following/Following';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import './FollowingPage.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCurrentActorFollowing } from '../../api/requests/actor';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';

export const FollowingPage: React.FC = () => {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const currentActorId = user?.id ?? null;
    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id || '');
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        const fetchActorFollowing = async () => {
            setLoading(true);
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let response: any;
                
                if (decodedUrl !== 'me' && decodedUrl !== currentActorId) {
                    // Load other users following
                } else {
                    response = await getCurrentActorFollowing();
                    console.log(response)
                };
                setFollowing(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                toast.error('Unable to load following!')
            } finally {
                setLoading(false);
            }
        };
        fetchActorFollowing();
    }, [decodedUrl]);

    if (loading) return (
        <LoadingPage />
    );
    
    return (
        <PageLayout>
            <div className='notifications-container'>
                <h1 className='section-title'>Following</h1>
                <div className='follow-requests-container'>
                    {following.map(actor => (
                        <Following
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