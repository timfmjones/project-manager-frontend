import { Link } from 'react-router-dom';
import { Project } from '../../lib/types';
import { formatDate } from '../../lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/project/${project.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
      {project.summaryBanner && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.summaryBanner}</p>
      )}
      <p className="text-xs text-gray-500">Updated {formatDate(project.updatedAt)}</p>
    </Link>
  );
}