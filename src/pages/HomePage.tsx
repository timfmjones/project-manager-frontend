import { useProjects } from '../hooks/useProjects';
import { ProjectGrid } from '../components/layout/ProjectGrid';
import { DashboardQA } from '../components/projects/DashboardQA';

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
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Projects</h1>
        <p className="text-gray-600">
          {projects.length === 0 
            ? "Welcome! Create your first project to get started."
            : `You have ${projects.length} active project${projects.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {/* AI Assistant Section */}
      <DashboardQA projects={projects} />

      {/* Projects Grid */}
      <ProjectGrid projects={projects} onProjectCreated={refetch} />
      
      {/* Quick Stats (if there are projects) */}
      {projects.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(Math.max(...projects.map(p => new Date(p.updatedAt).getTime()))).toLocaleDateString()}
                </p>
              </div>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => {
                    const updatedDate = new Date(p.updatedAt);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return updatedDate > oneWeekAgo;
                  }).length}
                </p>
              </div>
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Productivity Tips */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Productivity Tip
        </h3>
        <p className="text-sm text-gray-700">
          {projects.length === 0 
            ? "Start your first project by clicking the 'Create Project' button. Give it a clear, motivating name that represents your goal!"
            : projects.length === 1
            ? "Focus on your single project to build momentum. Try to complete at least 3 tasks today to establish a productive routine."
            : `With ${projects.length} projects, prioritization is key. Use the AI assistant above to help identify which project needs your attention most today.`
          }
        </p>
      </div>
    </div>
  );
}