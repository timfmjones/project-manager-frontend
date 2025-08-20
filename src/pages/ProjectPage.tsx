import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProject } from '../hooks/useProject';
import { useTasks } from '../hooks/useTasks';
import { useInsights } from '../hooks/useInsights';
import { useMilestones } from '../hooks/useMilestones';
import { SummaryBanner } from '../components/projects/SummaryBanner';
import { SummarySuggestDialog } from '../components/projects/SummarySuggestDialog';
import { RecordThoughts } from '../components/projects/RecordThoughts';
import { InsightsFeed } from '../components/projects/InsightsFeed';
import { KanbanBoard } from '../components/projects/KanbanBoard';
import { MilestonesPanel } from '../components/projects/MilestonesPanel';
import { api } from '../lib/api';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, updateProject } = useProject(id!);
  const { tasks, createTask, updateTask } = useTasks(id!);
  const { insights, refetch: refetchInsights, togglePin } = useInsights(id!);
  const { milestones, createMilestone, updateMilestone, deleteMilestone } = useMilestones(id!);
  const [suggestedSummary, setSuggestedSummary] = useState<string | null>(null);

  useEffect(() => {
    if (insights.length >= 3 && !project?.summaryBanner) {
      suggestSummary();
    }
  }, [insights.length, project?.summaryBanner]);

  const suggestSummary = async () => {
    try {
      const response = await api.post(`/api/projects/${id}/summary/suggest`);
      setSuggestedSummary(response.data.suggestedSummary);
    } catch (error) {
      console.error('Failed to get summary suggestion:', error);
    }
  };

  const handleAcceptSuggestion = async () => {
    if (suggestedSummary && project) {
      await updateProject({ summaryBanner: suggestedSummary });
      setSuggestedSummary(null);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{project.name}</h1>
      
      <SummaryBanner
        projectId={project.id}
        summary={project.summaryBanner}
        onUpdate={(newSummary) => updateProject({ summaryBanner: newSummary })}
      />

      <RecordThoughts
        projectId={project.id}
        onRecorded={refetchInsights}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={updateTask}
            onTaskCreate={createTask}
          />
        </div>
        
        <div className="space-y-6">
          <InsightsFeed
            insights={insights}
            onPinToggle={togglePin}
          />
          
          <MilestonesPanel
            milestones={milestones}
            onMilestoneCreate={createMilestone}
            onMilestoneUpdate={updateMilestone}
            onMilestoneDelete={deleteMilestone}
          />
        </div>
      </div>

      {suggestedSummary && (
        <SummarySuggestDialog
          suggestedSummary={suggestedSummary}
          onAccept={handleAcceptSuggestion}
          onReject={() => setSuggestedSummary(null)}
        />
      )}
    </div>
  );
}