import { Link } from "react-router-dom";
import { projectsData } from "../lib/projectsData";

export default function Projects() {
  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8">Projects</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projectsData.map((project) => (
            <div
              key={project.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {project.title}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap">
                {project.detailedContent && (
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-gray-900 dark:text-gray-100 hover:text-link-hover font-medium"
                  >
                    Read More
                  </Link>
                )}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 dark:text-gray-100 hover:text-link-hover font-medium"
                >
                  GitHub
                </a>
                {project.deployment && (
                  <a
                    href={project.deployment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-gray-100 hover:text-link-hover font-medium"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}