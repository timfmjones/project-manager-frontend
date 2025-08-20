import { Task } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export function Column({ title, tasks, status, onTaskUpdate }: ColumnProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onTaskUpdate(taskId, { status });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="bg-gray-50 rounded-lg p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">No tasks</p>
        )}
      </div>
    </div>
  );
}