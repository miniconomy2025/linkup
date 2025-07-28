import React, { useState } from 'react';
import './PostImage.css';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';

export const PostImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading && <div className="image-loader"><LoadingSpinner /></div>}
            <img
                src={src}
                alt={alt}
                style={{ display: loading ? "none" : "block" }}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
            />
        </>
    );
};
