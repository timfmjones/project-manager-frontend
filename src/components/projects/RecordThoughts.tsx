import { useState, useRef } from 'react';
import { api } from '../../lib/api';

interface RecordThoughtsProps {
  projectId: string;
  onRecorded: () => void;
}

export function RecordThoughts({ projectId, onRecorded }: RecordThoughtsProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextSubmit = async () => {
    if (!text.trim()) return;
    
    setSubmitting(true);
    try {
      await api.post(`/api/projects/${projectId}/idea-dumps/text`, {
        contentText: text,
      });
      setText('');
      onRecorded();
    } catch (error) {
      console.error('Failed to submit text:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/api/projects/${projectId}/idea-dumps/audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onRecorded();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload audio:', error);
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
      </div>
    </div>
  );
}