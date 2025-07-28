import FollowRequest from '../../components/followRequest/FollowRequest';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import './NotificationsPage.css';

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

export const NotificationsPage: React.FC = () => {
    return (
        <PageLayout>
            <div className='notifications-container'>
                <div className='follow-requests-container'>
                    <h1 className='section-title'>Follow Requests</h1>
                    {mockFollowRequests.map(followRequest => (
                        <FollowRequest 
                            id={followRequest.userId} 
                            name={followRequest.name} 
                            username={followRequest.username} 
                            avatar={followRequest.avatar} 
                        />
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};