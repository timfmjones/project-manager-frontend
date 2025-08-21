// src/components/projects/Column.tsx
import { useState } from 'react';
import { Task } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function Column({ title, tasks, status, onTaskUpdate, onTaskDelete }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskUpdate(taskId, { status });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const getColumnColor = () => {
    switch (status) {
      case 'TODO': return 'bg-gray-50';
      case 'IN_PROGRESS': return 'bg-blue-50';
      case 'DONE': return 'bg-green-50';
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case 'TODO': return 'border-gray-200';
      case 'IN_PROGRESS': return 'border-blue-200';
      case 'DONE': return 'border-green-200';
    }
  };

  return (
    <div
      className={`${getColumnColor()} rounded-lg p-3 md:p-4 transition-all border-2 ${
        isDragOver ? 'border-blue-400 scale-[1.02]' : getBorderColor()
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700 text-sm md:text-base">{title}</h3>
        <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            {isDragOver ? (
              <p className="text-blue-600 font-medium">Drop here!</p>
            ) : (
              <p>No tasks</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}