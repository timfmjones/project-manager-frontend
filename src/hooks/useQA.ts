import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { QAQuestion, QAResponse } from '../lib/types';

export function useQA(projectId: string) {
  const [history, setHistory] = useState<QAQuestion[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/projects/${projectId}/qa/history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch Q&A history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}/qa/suggestions`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const askQuestion = async (
    question: string,
    includeExamples: boolean = true
  ): Promise<QAResponse | null> => {
    try {
      setAsking(true);
      const response = await api.post(`/api/projects/${projectId}/qa/ask`, {
        question,
        includeExamples,
      });
      
      // Add to history
      const newQuestion: QAQuestion = {
        id: response.data.id,
        projectId,
        question: response.data.question,
        answer: response.data.answer,
        suggestions: response.data.suggestions,
        examples: response.data.examples,
        helpful: null,
        createdAt: response.data.createdAt,
      };
      
      setHistory(prev => [newQuestion, ...prev]);
      
      // Update suggestions with the new ones from the response
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        setSuggestions(response.data.suggestions);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to ask question:', error);
      if (error.response?.status === 429) {
        throw new Error('Too many questions. Please try again later.');
      }
      throw new Error(error.response?.data?.error || 'Failed to get answer');
    } finally {
      setAsking(false);
    }
  };

  const provideFeedback = async (questionId: string, helpful: boolean) => {
    try {
      await api.patch(`/api/qa/${questionId}/feedback`, { helpful });
      
      // Update local history
      setHistory(prev =>
        prev.map(q => (q.id === questionId ? { ...q, helpful } : q))
      );
    } catch (error) {
      console.error('Failed to provide feedback:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchHistory();
      fetchSuggestions();
    }
  }, [projectId]);

  return {
    history,
    suggestions,
    loading,
    asking,
    askQuestion,
    provideFeedback,
    refetchHistory: fetchHistory,
    refetchSuggestions: fetchSuggestions,
  };
}