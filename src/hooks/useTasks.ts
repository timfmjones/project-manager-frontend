import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Task } from '../lib/types';

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (title: string, description?: string) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/tasks`, {
        title,
        description,
      });
      setTasks(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await api.patch(`/api/tasks/${taskId}`, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    refetch: fetchTasks,
  };
}