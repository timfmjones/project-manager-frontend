import { useState, useRef } from 'react';
import { api } from '../../lib/api';
import { Insight } from '../../lib/types';

interface RecordThoughtsProps {
  projectId: string;
  onInsightGenerated: (newInsight: Insight) => void;
  onTasksCreated?: (count: number) => void;
}

export function RecordThoughts({ projectId, onInsightGenerated, onTasksCreated }: RecordThoughtsProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = async () => {
    if (!text.trim()) return;
    
    setSubmitting(true);
    setProcessingMessage('Submitting your idea...');
    
    try {
      const response = await api.post(`/api/projects/${projectId}/idea-dumps/text`, {
        contentText: text,
      });
      
      // The backend now returns the generated insight immediately
      if (response.data.insight) {
        onInsightGenerated(response.data.insight);
        
        // If tasks were created, trigger a refresh
        if (response.data.createdTasks > 0 && onTasksCreated) {
          onTasksCreated(response.data.createdTasks);
        }
      }
      
      setText('');
      setProcessingMessage('');
    } catch (error) {
      console.error('Failed to submit text:', error);
      setProcessingMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitting(true);
    setProcessingMessage('Transcribing and analyzing audio...');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(`/api/projects/${projectId}/idea-dumps/audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // The backend now returns the generated insight immediately
      if (response.data.insight) {
        onInsightGenerated(response.data.insight);
        
        // If tasks were created, trigger a refresh
        if (response.data.createdTasks > 0 && onTasksCreated) {
          onTasksCreated(response.data.createdTasks);
        }
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setProcessingMessage('');
    } catch (error) {
      console.error('Failed to upload audio:', error);
      setProcessingMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Record Your Thoughts</h2>
      
      <div className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your ideas here..."
            className="w-full p-3 border rounded-lg resize-none"
            rows={4}
            disabled={submitting}
          />
          <button
            onClick={handleTextSubmit}
            disabled={submitting || !text.trim()}
            className="btn-primary mt-2"
          >
            {submitting ? 'Processing...' : 'Submit Text'}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Or</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            disabled={submitting}
            className="file:btn-secondary file:mr-2"
          />
        </div>
        
        {processingMessage && (
          <div className="text-sm text-blue-600 italic">
            {processingMessage}
          </div>
        )}
      </div>
    </div>
  );
}