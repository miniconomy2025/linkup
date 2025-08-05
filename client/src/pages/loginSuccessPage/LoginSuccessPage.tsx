import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../hooks/useAuth';
import { LoadingPage } from '../../components/loadingSpinner/LoadingSpinner';

interface DecodedToken {
    id: string;
    name: string;
    email: string;
    picture?: string;
};

export const LoginSuccessPage = () => {
    
    const navigate = useNavigate();

    const { setUser } = useAuth();

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const token = params.get('token');

        if (token) {

            localStorage.setItem('token', token);

            const decoded = jwtDecode<DecodedToken>(token);

            const user = {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture || '',
            };
            
            setUser(user);

            localStorage.setItem('user', JSON.stringify(user));

            window.history.replaceState({}, '', '/login/success');

            navigate('/feed');
        };
    }, []);

    return (
        <LoadingPage />
    );
};