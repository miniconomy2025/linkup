import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./CreatePostPage.css";
import { PageLayout } from "../../components/pageLayout/PageLayout";

const CreatePostPage: React.FC = () => {
    const [postType, setPostType] = useState<"image" | "text" | null>(null);
    const [caption, setCaption] = useState("");
    const [textContent, setTextContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": [] },
        onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String); // still use this for preview
            };
            reader.readAsDataURL(file); // <- this converts to base64
        }
        },
        multiple: false,
    });

    const handlePostSubmit = () => {
        if (postType === "image" && imagePreview) {
            const payload = {
                caption,
                image: imagePreview, // base64 string
            };
            console.log("Sending image post payload:", payload);
            // send to API with fetch/axios etc.
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
            onClick={() => setPostType("image")}
            >
            Image
            </button>
            <button
            className={postType === "text" ? "active" : ""}
            onClick={() => setPostType("text")}
            >
            Text
            </button>
        </div>

        {postType === "image" && (
            <div className="image-post-section">
            <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                {imagePreview ? (
                <img src={imagePreview} alt="preview" className="image-preview" />
                ) : (
                <p>Drag and drop an image here, or click to select a file</p>
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
