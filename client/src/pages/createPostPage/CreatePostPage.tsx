import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './CreatePostPage.css';
import { PageLayout } from '../../components/pageLayout/PageLayout';
import { newImagePost, newTextPost, newVideoPost } from '../../api/requests/posts';
import { toast } from 'react-toastify';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';

const CreatePostPage: React.FC = () => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    
    const [postType, setPostType] = useState<'image' | 'text' | 'video' | null>(null);
    const [caption, setCaption] = useState('');
    const [textContent, setTextContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const notifySuccess = () => toast.success('Post created Successfully!');
    const notifyError = () => toast.error('Error! Something went wrong.');

    const { getRootProps, getInputProps } = useDropzone({
        accept: postType === 'video' ? { 'video/*': [] } : { 'image/*': [] },
        onDrop: (acceptedFiles, fileRejections) => {
            if (fileRejections.length > 0) {
                alert(`File too large. Maximum allowed size is 5MB.`);
                return;
            };
            const file = acceptedFiles[0];
            if (file) {
                setMediaFile(file);
                setMediaPreview(URL.createObjectURL(file));
            };
        },
        multiple: false,
        disabled: postType !== 'image' && postType !== 'video',
        maxSize: MAX_FILE_SIZE
    });

    const handlePostSubmit = async () => {
        if (postType === 'text' && textContent.length > 1500) {
            toast.error('Text post content cannot exceed 1500 characters.');
            return;
        }

        setLoading(true);
        try {
            if (postType === 'image' && mediaPreview) {
                const formData = new FormData();
                if (!mediaFile) throw new Error('No file set.');
                formData.append('file', mediaFile);
                formData.append('caption', caption);
                await newImagePost(formData);
            } else if (postType === 'video' && mediaPreview) {
                const formData = new FormData();
                if (!mediaFile) throw new Error('No file set.');
                formData.append('file', mediaFile);
                formData.append('caption', caption);
                await newVideoPost(formData);
            } else if (postType === 'text') {
                await newTextPost({ content: textContent });
            }
            notifySuccess();
            setPostType(null);
            setTextContent('');
            setCaption('');
            setMediaFile(null);
            setMediaPreview(null);
        } catch (err) {
            notifyError();
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <LoadingPage />
    )

    return (
        <PageLayout>
            <div className='create-post-container'>
                <h2>Create Post</h2>

                <div className='post-type-buttons'>
                    <button
                        className={postType === 'image' ? 'active' : ''}
                        onClick={() => {
                            setPostType('image');
                            setMediaFile(null);
                            setMediaPreview(null);
                        }}
                    >
                        Image
                    </button>
                    <button
                        className={postType === 'text' ? 'active' : ''}
                        onClick={() => {
                            setPostType('text');
                            setMediaFile(null);
                            setMediaPreview(null);
                        }}
                    >
                        Text
                    </button>
                    <button
                        className={postType === 'video' ? 'active' : ''}
                        onClick={() => {
                            setPostType('video');
                            setMediaFile(null);
                            setMediaPreview(null);
                        }}
                    >
                        Video
                    </button>
                </div>

                {(postType === 'image' || postType === 'video') && (
                    <div className='media-post-section'>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            {mediaPreview ? (
                                postType === 'image' ? (
                                    <img src={mediaPreview} alt='preview' className='image-preview' />
                                ) : (
                                    <video controls className='video-preview'>
                                        <source src={mediaPreview} />
                                        Your browser does not support the video tag.
                                    </video>
                                )
                            ) : (
                                <p>Drag and drop a {postType} here, or click to select a file</p>
                            )}
                        </div>
                        <input
                            type='text'
                            placeholder='Add a caption...'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className='caption-input'
                        />
                    </div>
                )}

                {postType === 'text' && (
                    <div className='text-post-section'>
                        <textarea
                            placeholder='Write your post...'
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className='text-area'
                            maxLength={1500}
                        />
                        <div className='char-counter'>{textContent.length}/1500</div>
                    </div>
                )}

                {postType && (
                    <button className='submit-btn' onClick={handlePostSubmit}>
                        Submit Post
                    </button>
                )}
            </div>
        </PageLayout>
    );
};

export default CreatePostPage;
