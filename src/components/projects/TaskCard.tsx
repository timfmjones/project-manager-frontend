import { Task } from '../../lib/types';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white p-3 rounded shadow-sm cursor-move hover:shadow-md transition-shadow"
    >
      <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
      )}
    </div>
  );
}