// src/components/projects/NewMilestoneForm.tsx
import { useState } from 'react';

interface NewMilestoneFormProps {
  onSubmit: (title: string, description?: string, dueDate?: string) => void;
  onCancel: () => void;
}

export function NewMilestoneForm({ onSubmit, onCancel }: NewMilestoneFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Convert empty strings to undefined for optional fields
      onSubmit(
        title.trim(),
        description.trim() || undefined,
        dueDate || undefined
      );
    }
  };

  // Get current date/time in the format required by datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">New Milestone</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Milestone title"
              className="input w-full"
              autoFocus
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="input w-full"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={getCurrentDateTime()}
              className="input w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Set a target date for this milestone</p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!title.trim()}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}