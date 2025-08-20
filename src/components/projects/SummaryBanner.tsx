import { useState } from 'react';
import { api } from '../../lib/api';

interface SummaryBannerProps {
  projectId: string;
  summary: string;
  onUpdate: (newSummary: string) => void;
}

export function SummaryBanner({ projectId, summary, onUpdate }: SummaryBannerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(summary);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/api/projects/${projectId}/summary`, {
        summaryBanner: editValue,
      });
      onUpdate(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update summary:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(summary);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 border rounded resize-none"
          rows={3}
          maxLength={220}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">{editValue.length}/220</span>
          <div className="space-x-2">
            <button onClick={handleCancel} className="btn-secondary text-sm">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative group">
      <p className="text-gray-800">
        {summary || 'Click to add a project summary...'}
      </p>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </div>
  );
}