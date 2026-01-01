import { useParams, Link } from "react-router-dom";
import { projectsData } from "../lib/projectsData";

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectsData.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center flex-grow p-6">
        <div className="w-full max-w-2xl text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Project Not Found</h1>
          <p className="text-gray-700 dark:text-gray-300">The project you're looking for doesn't exist.</p>
          <Link
            to="/projects"
            className="text-link-hover hover:underline"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-4xl space-y-6">
        <Link
          to="/projects"
          className="text-link-hover hover:underline mb-4 inline-block"
        >
          ← Back to Projects
        </Link>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">{project.description}</p>
            </div>

            <div className="flex gap-4 flex-shrink-0">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                GitHub
              </a>
              {project.deployment && (
                <a
                  href={project.deployment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.detailedContent && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: project.detailedContent.replace(/\n/g, '<br />').replace(/#{1,6}\s/g, match => {
                    const level = match.trim().length;
                    return level === 1 ? '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">' :
                      level === 2 ? '<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">' :
                        level === 3 ? '<h3 class="text-xl font-medium text-gray-900 dark:text-white mt-4 mb-2">' :
                          '<h4 class="text-lg font-medium text-gray-900 dark:text-white mt-3 mb-2">';
                  }).replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
                    .replace(/- (.*?)(<br \/>|$)/g, '<li class="ml-4">• $1</li>')
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}