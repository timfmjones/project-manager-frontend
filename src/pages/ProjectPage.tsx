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
import { Insight } from '../lib/types';
import { api } from '../lib/api';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, updateProject } = useProject(id!);
  const { tasks, createTask, updateTask, deleteTask, refetch: refetchTasks } = useTasks(id!);
  const { insights, togglePin } = useInsights(id!);
  const { milestones, createMilestone, updateMilestone, deleteMilestone } = useMilestones(id!);
  const [suggestedSummary, setSuggestedSummary] = useState<string | null>(null);
  const [localInsights, setLocalInsights] = useState<Insight[]>([]);

  // Initialize local insights when insights are loaded
  useEffect(() => {
    setLocalInsights(insights);
  }, [insights]);

  useEffect(() => {
    if (localInsights.length >= 3 && !project?.summaryBanner) {
      suggestSummary();
    }
  }, [localInsights.length, project?.summaryBanner]);

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

  // Handle new insight being generated
  const handleInsightGenerated = (newInsight: Insight) => {
    // Add the new insight to the beginning of the list (most recent first)
    setLocalInsights(prevInsights => [newInsight, ...prevInsights]);
    
    // Check if we should suggest a summary
    if (localInsights.length + 1 >= 3 && !project?.summaryBanner) {
      suggestSummary();
    }
  };

  // Handle tasks being created (refresh the tasks list)
  const handleTasksCreated = (count: number) => {
    if (count > 0) {
      refetchTasks();
    }
  };

  // Handle pin toggle with optimistic update
  const handlePinToggle = async (insightId: string, pinned: boolean) => {
    // Optimistically update local state
    setLocalInsights(prevInsights =>
      prevInsights.map(insight =>
        insight.id === insightId ? { ...insight, pinned } : insight
      )
    );
    
    // Then make the API call
    try {
      await togglePin(insightId, pinned);
    } catch (error) {
      // If it fails, revert the optimistic update
      setLocalInsights(prevInsights =>
        prevInsights.map(insight =>
          insight.id === insightId ? { ...insight, pinned: !pinned } : insight
        )
      );
      console.error('Failed to toggle pin:', error);
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
        onInsightGenerated={handleInsightGenerated}
        onTasksCreated={handleTasksCreated}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={updateTask}
            onTaskCreate={createTask}
            onTaskDelete={deleteTask}
          />
        </div>
        
        <div className="space-y-6">
          <InsightsFeed
            insights={localInsights}
            onPinToggle={handlePinToggle}
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