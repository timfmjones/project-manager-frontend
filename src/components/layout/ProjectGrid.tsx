import { ProjectCard } from '../projects/ProjectCard';
import { CreateProjectModal } from '../projects/CreateProjectModal';
import { Project } from '../../lib/types';
import { useState } from 'react';

interface ProjectGridProps {
  projects: Project[];
  onProjectCreated: () => void;
}

export function ProjectGrid({ projects, onProjectCreated }: ProjectGridProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors flex flex-col items-center justify-center space-y-2"
        >
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-gray-600 font-medium">Create Project</span>
        </button>
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            onProjectCreated();
          }}
        />
      )}
    </>
  );
}