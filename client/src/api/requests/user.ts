import { apiFetch } from '../client';

export const getTestAuth = () => apiFetch('/auth/test');
