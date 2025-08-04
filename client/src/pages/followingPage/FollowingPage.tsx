import Following from '../../components/following/Following';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import './FollowingPage.css';

const mockFollowing = [
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

export const FollowingPage: React.FC = () => {
    return (
        <PageLayout>
            <div className='notifications-container'>
                <h1 className='section-title'>Following</h1>
                <div className='follow-requests-container'>
                    {mockFollowing.map(actor => (
                        <Following
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