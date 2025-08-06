const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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

export async function apiPost<T>(path: string, data: unknown): Promise<T> {
    const token = localStorage.getItem('token');
    const isFormData = data instanceof FormData;

    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers,
        body: isFormData ? data as BodyInit : JSON.stringify(data),
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
