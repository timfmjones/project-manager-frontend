// src/components/projects/TaskCard.tsx
import { useState } from 'react';
import { Task } from '../../lib/types';

interface TaskCardProps {
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showActions, setShowActions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    if (editTitle.trim() && onUpdate) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const moveToStatus = (newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    if (onUpdate) {
      onUpdate(task.id, { status: newStatus });
      setShowActions(false);
    }
  };

  const getNextStatus = () => {
    switch (task.status) {
      case 'TODO': return 'IN_PROGRESS';
      case 'IN_PROGRESS': return 'DONE';
      case 'DONE': return 'TODO';
    }
  };

  const getPreviousStatus = () => {
    switch (task.status) {
      case 'TODO': return 'DONE';
      case 'IN_PROGRESS': return 'TODO';
      case 'DONE': return 'IN_PROGRESS';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded shadow-sm border-2 border-blue-500">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm font-medium mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-2 py-1 border rounded text-xs text-gray-600 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`bg-white p-3 rounded shadow-sm cursor-move hover:shadow-md transition-all relative group
          ${isDragging ? 'opacity-50 rotate-2 scale-95' : ''}
          ${showActions ? 'ring-2 ring-blue-500' : ''}
        `}
      >
        {/* Edit and Delete buttons - visible on hover (desktop) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 z-10">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-white hover:bg-gray-100 rounded shadow-sm"
            title="Edit task"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 bg-white hover:bg-gray-100 rounded shadow-sm"
              title="Delete task"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile action buttons - always visible on mobile */}
        <div className="flex space-x-1 mb-2 md:hidden">
          {onUpdate && (
            <>
              <button
                onClick={() => moveToStatus(getPreviousStatus())}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                title="Move left"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => moveToStatus(getNextStatus())}
                className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                title="Move right"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <div className="flex-1" />
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 bg-gray-100 rounded hover:bg-gray-200"
            title="Edit"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 bg-gray-100 rounded hover:bg-gray-200"
              title="Delete"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>

        <h4 className="font-medium text-gray-800 text-sm pr-16 md:pr-0">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description}</p>
        )}

        {/* Status indicator for mobile */}
        <div className="mt-2 md:hidden">
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.status === 'TODO' ? 'bg-gray-100 text-gray-700' :
            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
            {task.status === 'TODO' ? 'To Do' :
             task.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
          </span>
        </div>
      </div>
    </>
  );
}