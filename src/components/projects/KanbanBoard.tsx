// src/components/projects/KanbanBoard.tsx
import { useState } from 'react';
import { Task } from '../../lib/types';
import { Column } from './Column';
import { NewTaskForm } from './NewTaskForm';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (title: string, description?: string) => void;
  onTaskDelete?: (taskId: string) => void;
}

export function KanbanBoard({ tasks, onTaskUpdate, onTaskCreate, onTaskDelete }: KanbanBoardProps) {
  const [showNewTask, setShowNewTask] = useState(false);
  const [mobileView, setMobileView] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  const getTaskCounts = () => ({
    todo: todoTasks.length,
    inProgress: inProgressTasks.length,
    done: doneTasks.length,
  });

  const counts = getTaskCounts();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button
          onClick={() => setShowNewTask(true)}
          className="btn-primary text-sm flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Task</span>
        </button>
      </div>

      {/* Mobile view tabs */}
      <div className="md:hidden mb-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMobileView('TODO')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              mobileView === 'TODO' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            To Do ({counts.todo})
          </button>
          <button
            onClick={() => setMobileView('IN_PROGRESS')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              mobileView === 'IN_PROGRESS' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            In Progress ({counts.inProgress})
          </button>
          <button
            onClick={() => setMobileView('DONE')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              mobileView === 'DONE' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Done ({counts.done})
          </button>
        </div>
      </div>

      {/* Desktop view - 3 columns */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        <Column
          title="To Do"
          tasks={todoTasks}
          status="TODO"
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          status="IN_PROGRESS"
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
        <Column
          title="Done"
          tasks={doneTasks}
          status="DONE"
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      </div>

      {/* Mobile view - single column */}
      <div className="md:hidden">
        {mobileView === 'TODO' && (
          <Column
            title="To Do"
            tasks={todoTasks}
            status="TODO"
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        )}
        {mobileView === 'IN_PROGRESS' && (
          <Column
            title="In Progress"
            tasks={inProgressTasks}
            status="IN_PROGRESS"
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        )}
        {mobileView === 'DONE' && (
          <Column
            title="Done"
            tasks={doneTasks}
            status="DONE"
            onTaskUpdate={onTaskUpdate}
            onTaskDelete={onTaskDelete}
          />
        )}
      </div>

      {/* Task statistics */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Progress Overview</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">To Do: {counts.todo}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">In Progress: {counts.inProgress}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Done: {counts.done}</span>
          </div>
        </div>
        {tasks.length > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(counts.done / tasks.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((counts.done / tasks.length) * 100)}% Complete
            </p>
          </div>
        )}
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