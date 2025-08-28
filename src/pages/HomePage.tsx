import { useProjects } from '../hooks/useProjects';
import { ProjectGrid } from '../components/layout/ProjectGrid';

export function HomePage() {
  const { projects, loading, refetch } = useProjects();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading projects...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
      <ProjectGrid projects={projects} onProjectCreated={refetch} />
    </div>
  );
}