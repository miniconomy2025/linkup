const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized, redirecting...');
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = '/login';
        };

        const errorData = await response.json();
        throw new Error(errorData.message || 'API Error');
    };

    return response.json();
};
