import React from 'react';
import './LoginPage.css';

export const LoginPage: React.FC = () => {

    const redirectToGoogle = () => {
        // Local - 931664523187-tttf6k218o12ioinl0cb19rqkebcu52r.apps.googleusercontent.com
        // Production - 931664523187-6a5itlf9unh9u4oohkcjv5s5c9b94a97.apps.googleusercontent.com
        // local - http://localhost:3000/auth/google/callback
        // production - http://ec2-13-244-78-172.af-south-1.compute.amazonaws.com/api/auth/google/callback

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '931664523187-6a5itlf9unh9u4oohkcjv5s5c9b94a97.apps.googleusercontent.com';
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://ec2-13-244-78-172.af-south-1.compute.amazonaws.com/api/auth/google/callback';
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
