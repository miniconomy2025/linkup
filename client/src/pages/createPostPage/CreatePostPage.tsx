import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./CreatePostPage.css";
import { PageLayout } from "../../components/pageLayout/PageLayout";

const CreatePostPage: React.FC = () => {
    const [postType, setPostType] = useState<"image" | "text" | "video" | null>(null);
    const [caption, setCaption] = useState("");
    const [textContent, setTextContent] = useState("");
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: postType === "video" ? { "video/*": [] } : { "image/*": [] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setMediaFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setMediaPreview(base64String);
                };
                reader.readAsDataURL(file); // For previewing
            }
        },
        multiple: false,
        disabled: postType !== "image" && postType !== "video",
    });

    const handlePostSubmit = () => {
        if (postType === "image" && mediaPreview) {
            const payload = {
                caption,
                image: mediaPreview,
            };
            console.log("Sending image post payload:", payload);
        } else if (postType === "video" && mediaPreview) {
            const payload = {
                caption,
                video: mediaPreview,
            };
            console.log("Sending video post payload:", payload);
        } else if (postType === "text") {
            const payload = {
                caption,
                content: textContent,
            };
            console.log("Sending text post payload:", payload);
        }
    };

    return (
        <PageLayout>
            <div className="create-post-container">
                <h2>Create Post</h2>

                <div className="post-type-buttons">
                    <button
                        className={postType === "image" ? "active" : ""}
                        onClick={() => {
                            setPostType("image");
                            setMediaFile(null);
                            setMediaPreview(null);
                        }}
                    >
                        Image
                    </button>
                    <button
                        className={postType === "text" ? "active" : ""}
                        onClick={() => {
                            setPostType("text");
                            setMediaFile(null);
                            setMediaPreview(null);
                        }}
                    >
                        Text
                    </button>
                    <button
                        className={postType === "video" ? "active" : ""}
                        onClick={() => {
                            setPostType("video");
                            setMediaFile(null);
                            setMediaPreview(null);
                        }}
                    >
                        Video
                    </button>
                </div>

                {(postType === "image" || postType === "video") && (
                    <div className="media-post-section">
                        <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            {mediaPreview ? (
                                postType === "image" ? (
                                    <img src={mediaPreview} alt="preview" className="image-preview" />
                                ) : (
                                    <video controls className="video-preview">
                                        <source src={mediaPreview} />
                                        Your browser does not support the video tag.
                                    </video>
                                )
                            ) : (
                                <p>Drag and drop a {postType} here, or click to select a file</p>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="caption-input"
                        />
                    </div>
                )}

                {postType === "text" && (
                    <div className="text-post-section">
                        <textarea
                            placeholder="Write your post..."
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            className="text-area"
                        />
                        <input
                            type="text"
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="caption-input"
                        />
                    </div>
                )}

                {postType && (
                    <button className="submit-btn" onClick={handlePostSubmit}>
                        Submit Post
                    </button>
                )}
            </div>
        </PageLayout>
    );
};

export default CreatePostPage;
