import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Insight } from '../lib/types';

export function useInsights(projectId: string) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}/insights`);
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (insightId: string, pinned: boolean) => {
    try {
      await api.patch(`/api/insights/${insightId}/pin`, { pinned });
      setInsights(prev => 
        prev.map(i => i.id === insightId ? { ...i, pinned } : i)
      );
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [projectId]);

  return {
    insights,
    loading,
    togglePin,
    refetch: fetchInsights,
  };
}