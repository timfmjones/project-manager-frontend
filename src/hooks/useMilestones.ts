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
      const response = await api.post(`/api/projects/${projectId}/milestones`, {
        title,
        description,
        dueDate,
      });
      setMilestones(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Failed to create milestone:', error);
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    try {
      const response = await api.patch(`/api/milestones/${id}`, updates);
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