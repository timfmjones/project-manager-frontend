// src/hooks/useMilestones.ts
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Milestone } from '../lib/types';

export function useMilestones(projectId: string) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}/milestones`);
      setMilestones(response.data);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMilestone = async (title: string, description?: string, dueDate?: string) => {
    try {
      console.log('Creating milestone with:', { title, description, dueDate }); // Debug log
      
      // Prepare the data, ensuring we send the right format
      const data: any = { title };
      
      // Only include description if it's provided and not empty
      if (description) {
        data.description = description;
      }
      
      // Only include dueDate if it's provided
      if (dueDate) {
        // Convert datetime-local format to ISO string
        const dateObj = new Date(dueDate);
        data.dueDate = dateObj.toISOString();
      }
      
      const response = await api.post(`/api/projects/${projectId}/milestones`, data);
      setMilestones(prev => [...prev, response.data]);
    } catch (error: any) {
      console.error('Failed to create milestone:', error);
      console.error('Error response:', error.response?.data);
      // You might want to throw the error here or handle it differently
      // throw error;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    try {
      // If updating dueDate, ensure it's in ISO format
      const data = { ...updates };
      if (data.dueDate) {
        const dateObj = new Date(data.dueDate);
        data.dueDate = dateObj.toISOString();
      }
      
      const response = await api.patch(`/api/milestones/${id}`, data);
      setMilestones(prev => prev.map(m => m.id === id ? response.data : m));
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      await api.delete(`/api/milestones/${id}`);
      setMilestones(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete milestone:', error);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  return {
    milestones,
    loading,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    refetch: fetchMilestones,
  };
}