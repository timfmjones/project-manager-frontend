// src/pages/ProjectPage.tsx
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
import { QAPanel } from '../components/projects/QAPanel';
import { api } from '../lib/api';

export function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, updateProject } = useProject(id!);
  const { tasks, createTask, updateTask, deleteTask, refetch: refetchTasks } = useTasks(id!);
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{project.name}</h1>
      
      <SummaryBanner
        projectId={project.id}
        summary={project.summaryBanner}
        onUpdate={(newSummary) => updateProject({ summaryBanner: newSummary })}
      />

      <RecordThoughts
        projectId={project.id}
        onRecorded={refetchInsights}
      />

      {/* Main Layout with Q&A Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side - Main content (Tasks, Insights, Milestones) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tasks section */}
          <KanbanBoard
            tasks={tasks}
            onTaskUpdate={updateTask}
            onTaskCreate={createTask}
            onTaskDelete={deleteTask}
          />
          
          {/* Two column layout for Insights and Milestones on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Right side - Q&A Panel (sticky on desktop) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <QAPanel
              projectId={project.id}
              projectName={project.name}
              onTasksCreated={refetchTasks}
            />
          </div>
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