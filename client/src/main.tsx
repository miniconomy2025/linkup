import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth';
import App from './App.tsx'
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Local - 931664523187-tttf6k218o12ioinl0cb19rqkebcu52r.apps.googleusercontent.com
// Production - 931664523187-6a5itlf9unh9u4oohkcjv5s5c9b94a97.apps.googleusercontent.com

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '931664523187-tttf6k218o12ioinl0cb19rqkebcu52r.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>,
);