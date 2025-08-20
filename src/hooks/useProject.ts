import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Project } from '../lib/types';

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updates: Partial<Project>) => {
    try {
      await api.patch(`/api/projects/${projectId}`, updates);
      setProject(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return {
    project,
    loading,
    updateProject,
    refetch: fetchProject,
  };
}