import Followers from '../../components/follower/Followers';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import './FollowersPage.css';

const mockFollowRequests = [
    {
        userId: 1,
        name: 'Chris',
        username: 'chrismchardy123',
        avatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
        userId: 2,
        name: 'Chris',
        username: 'chrismchardy123',
        avatar: 'https://i.pravatar.cc/150?u=1',
    },
     {
        userId: 3,
        name: 'Chris',
        username: 'chrismchardy123',
        avatar: 'https://i.pravatar.cc/150?u=1',
    }
]

export const FollowersPage: React.FC = () => {
    return (
        <PageLayout>
            <div className='notifications-container'>
                <h1 className='section-title'>Followers</h1>
                <div className='follow-requests-container'>
                    {mockFollowRequests.map(actor => (
                        <Followers
                            id={actor.userId} 
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