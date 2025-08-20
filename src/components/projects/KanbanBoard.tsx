import { useState } from 'react';
import { Task } from '../../lib/types';
import { Column } from './Column';
import { NewTaskForm } from './NewTaskForm';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (title: string, description?: string) => void;
}

export function KanbanBoard({ tasks, onTaskUpdate, onTaskCreate }: KanbanBoardProps) {
  const [showNewTask, setShowNewTask] = useState(false);

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button
          onClick={() => setShowNewTask(true)}
          className="btn-primary text-sm"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Column
          title="To Do"
          tasks={todoTasks}
          status="TODO"
          onTaskUpdate={onTaskUpdate}
        />
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          status="IN_PROGRESS"
          onTaskUpdate={onTaskUpdate}
        />
        <Column
          title="Done"
          tasks={doneTasks}
          status="DONE"
          onTaskUpdate={onTaskUpdate}
        />
      </div>

      {showNewTask && (
        <NewTaskForm
          onSubmit={(title, description) => {
            onTaskCreate(title, description);
            setShowNewTask(false);
          }}
          onCancel={() => setShowNewTask(false)}
        />
      )}
    </div>
  );
}