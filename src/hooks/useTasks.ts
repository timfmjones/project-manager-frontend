// src/hooks/useTasks.ts
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

  const deleteTask = async (taskId: string) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  // const deleteTask = async (taskId: string) => {
  //   // Optimistic update - remove the task immediately
  //   const taskToDelete = tasks.find(t => t.id === taskId);
  //   setTasks(prev => prev.filter(t => t.id !== taskId));
    
  //   try {
  //     await api.delete(`/api/tasks/${taskId}`);
  //   } catch (error) {
  //     // Revert on error - add the task back
  //     console.error('Failed to delete task:', error);
  //     if (taskToDelete) {
  //       setTasks(prev => [...prev, taskToDelete]);
  //     }
  //     fetchTasks(); // Refetch to get correct state
  //   }
  // };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}