import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchTasks() {
  const { data } = await api.get('/tasks');
  return data;
}

export async function createTask({ titulo, prioridade }) {
  const { data } = await api.post('/tasks', { titulo, prioridade });
  return data;
}

export async function updateTask(id, changes) {
  const { data } = await api.put(`/tasks/${id}`, changes);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}
