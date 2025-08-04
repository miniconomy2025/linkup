import React from 'react';
import './LoginPage.css';

export const LoginPage: React.FC = () => {

    const redirectToGoogle = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '931664523187-tttf6k218o12ioinl0cb19rqkebcu52r.apps.googleusercontent.com';
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';
        const scope = 'openid profile email';
        const url =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
        window.location.href = url;
    };

    return (
        <div className="login-container">
            <h2>Sign In to LinkUp</h2>
            <button className="google-button" onClick={redirectToGoogle}>
                <img src={"https://img.icons8.com/color/48/000000/google-logo.png"} alt={"Google icon"} />
                Continue with Google
            </button>
        </div>
    );
};
