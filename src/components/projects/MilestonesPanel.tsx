import { useState } from 'react';
import { Milestone } from '../../lib/types';
import { MilestoneItem } from './MilestoneItem';
import { NewMilestoneForm } from './NewMilestoneForm';

interface MilestonesPanelProps {
  milestones: Milestone[];
  onMilestoneCreate: (title: string, description?: string, dueDate?: string) => void;
  onMilestoneUpdate: (id: string, updates: Partial<Milestone>) => void;
  onMilestoneDelete: (id: string) => void;
}

export function MilestonesPanel({
  milestones,
  onMilestoneCreate,
  onMilestoneUpdate,
  onMilestoneDelete,
}: MilestonesPanelProps) {
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Milestones</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="btn-primary text-sm"
        >
          + Add Milestone
        </button>
      </div>

      <div className="space-y-3">
        {milestones.map((milestone) => (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            onUpdate={onMilestoneUpdate}
            onDelete={onMilestoneDelete}
          />
        ))}
        {milestones.length === 0 && (
          <p className="text-gray-500 text-center py-4">No milestones set</p>
        )}
      </div>

      {showNewForm && (
        <NewMilestoneForm
          onSubmit={(title, description, dueDate) => {
            onMilestoneCreate(title, description, dueDate);
            setShowNewForm(false);
          }}
          onCancel={() => setShowNewForm(false)}
        />
      )}
    </div>
  );
}