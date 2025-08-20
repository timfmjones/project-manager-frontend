import { api } from './api';
import { useStore } from './store';

export async function login(email: string, password: string) {
  const response = await api.post('/api/auth/login', { email, password });
  const { token, user } = response.data;
  useStore.getState().setAuth(token, user);
  return response.data;
}

export async function register(email: string, password: string) {
  const response = await api.post('/api/auth/register', { email, password });
  const { token, user } = response.data;
  useStore.getState().setAuth(token, user);
  return response.data;
}

export async function loginAsGuest() {
  const response = await api.post('/api/auth/guest');
  const { token, user } = response.data;
  useStore.getState().setAuth(token, user);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/api/auth/me');
  return response.data;
}