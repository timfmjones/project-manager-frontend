import { Milestone } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface MilestoneItemProps {
  milestone: Milestone;
  onUpdate: (id: string, updates: Partial<Milestone>) => void;
  onDelete: (id: string) => void;
}

export function MilestoneItem({ milestone, onDelete }: MilestoneItemProps) {
  return (
    <div className="border rounded-lg p-3 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{milestone.title}</h4>
          {milestone.description && (
            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
          )}
          {milestone.dueDate && (
            <p className="text-xs text-gray-500 mt-2">
              Due: {formatDate(milestone.dueDate)}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(milestone.id)}
          className="text-red-600 hover:text-red-800 ml-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}