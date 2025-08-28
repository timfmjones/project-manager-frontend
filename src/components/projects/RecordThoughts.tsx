import { useState, useRef } from 'react';
import { api } from '../../lib/api';
import { VoiceRecorder } from './VoiceRecorder';

interface RecordThoughtsProps {
  projectId: string;
  onRecorded: () => void;
}

export function RecordThoughts({ projectId, onRecorded }: RecordThoughtsProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'upload'>('text');
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

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    try {
      await api.post(`/api/projects/${projectId}/idea-dumps/audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onRecorded();
    } catch (error) {
      console.error('Failed to upload recording:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Record Your Thoughts</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 border-b">
        <button
          onClick={() => setActiveTab('text')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'text'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Text
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'voice'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Record
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload
        </button>
      </div>

      <div className="space-y-4">
        {/* Text Input Tab */}
        {activeTab === 'text' && (
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your ideas here..."
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        )}

        {/* Voice Recording Tab */}
        {activeTab === 'voice' && (
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            disabled={submitting}
          />
        )}

        {/* File Upload Tab */}
        {activeTab === 'upload' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">Audio files only (MP3, WAV, OGG, etc.)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              disabled={submitting}
              className="mt-4 file:btn-secondary file:mr-2"
            />
            {submitting && (
              <p className="mt-2 text-sm text-blue-600">Uploading and processing...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}