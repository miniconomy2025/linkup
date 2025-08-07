import './PostPage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { getPost } from '../../api/requests/posts';
import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { likePost } from '../../api/requests/activity';

export const PostPage: React.FC = () => {

    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id || '');
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<unknown>({});

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

    const handlePostLike = async (postId: string) => {
        try {
            await likePost({ postId });
            setPost((prevPost) => prevPost ? { ...prevPost, liked: true } : prevPost);
            toast.success("Liked post!")
        } catch (err) {
            console.log(err)
            notifyError();
        };
    };

    if (loading) return (
        <LoadingPage />
    );

    return (
        <PageLayout>
            <div className='post-container'>
                 <div className='post-tile-ind'>
                    {post?.type === 'Image' && (
                        <img src={post?.url} />
                    )}
                    {post?.type === 'Video' && (
                        <video
                            src={post?.url}
                            className='post-video'
                            playsInline
                            loop
                            controls
                        />
                    )}
                    {post?.type === 'Note' && (
                        <div className='post-media-note'>
                            <div className='post-content-scrollable'>{post.content}</div>
                        </div>
                    )}
                </div>
                {(post?.type === 'Image' || post?.type === 'Video') && (
                    <div>{post?.name}</div>
                )}
                {post.liked === false ? (
                    <FcLikePlaceholder
                        size={20} 
                        onClick={() => handlePostLike(post.id)} 
                        className='like-action' 
                    /> 
                ): (
                    <FcLike
                        size={20} 
                        className='like-action' 
                    /> 
                )}
            </div>
        </PageLayout>
    );
};