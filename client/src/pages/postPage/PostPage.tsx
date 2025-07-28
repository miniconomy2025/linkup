import './PostPage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { PostImage } from '../../components/postImage/PostImage';

const mockPost = {
    id: "1",
    username: "alice",
    content: "What a beautiful day!",
    image: "https://th.bing.com/th/id/R.d22aafa9433efcc9ed4d9a7808c05a8a?rik=8tekSpiFRq3jhg&riu=http%3a%2f%2fwww.pixelstalk.net%2fwp-content%2fuploads%2f2016%2f07%2fDownload-Free-Pictures-3840x2160.jpg&ehk=ZfChm9icVrVUFSnPnWsPaf7qOQGA9l1qj0BRZx4lTzE%3d&risl=&pid=ImgRaw&r=0",
    likes: 10,
    comments: 2,
};

export const PostPage: React.FC = () => {
    return (
        <PageLayout>
            <div className='post-container'>
                <div className='image-container'>
               <PostImage src={mockPost.image} alt='post'/>
                </div>
                <div>
                    comments
                </div>
            </div>
        </PageLayout>
    );
};