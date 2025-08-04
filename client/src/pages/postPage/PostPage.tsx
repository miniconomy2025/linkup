import './PostPage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { PostImage } from '../../components/postImage/PostImage';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { getPost } from '../../api/requests/posts';

export const PostPage: React.FC = () => {

    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id || '');
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState({});

    const notifyError = () => toast.error('Error! Something went wrong.');

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await getPost({
                    url: decodedUrl
                });
                console.log(response)
                setPost(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                notifyError();
            } finally {
                setLoading(false);
            };
        };
        fetchPost();
    }, []);

    if (loading) return (
        <LoadingPage />
    );

    return (
        <PageLayout>
            <div className='post-container'>
                <div className='image-container'>
                    {/* TODO handle if image */}
                    {/* TODO handle if note */}
                    {/* TODO handle if video */}
               {/* <PostImage src={post.image} alt='post'/> */}
                </div>
                <div>
                    comments
                </div>
            </div>
        </PageLayout>
    );
};