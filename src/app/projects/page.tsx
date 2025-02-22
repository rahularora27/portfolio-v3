import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import LinkIcon from '@/components/ui/icon';

const projects = [
  {
    name: 'Typing Contest',
    description:
      'A real-time multiplayer typing game where users compete by typing given quotes.',
    github: 'https://github.com/rahularora27/typing-contest',
    live: 'https://typing-contest.vercel.app',
  },
  {
    name: 'Omegle AI Match',
    description:
      'An AI-powered chat platform that matches users based on their interests.',
    github: 'https://github.com/rahularora27/omegle-ai-match',
    live: 'https://omegle-ai.vercel.app',
  },
  {
    name: 'Library Management System',
    description:
      'A web-based system to manage books, borrowers, and transactions.',
    github: 'https://github.com/rahularora27/library-management',
    live: '#',
  },
];

export default function Projects() {
  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {projects.map(({ name, description, github, live }) => (
          <div key={name} className="border-b pb-4">
            {/* Container with responsive layout */}
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              {/* Left Side: Name & Description */}
              <div className="text-left">
                <h2 className="text-xl font-medium">{name}</h2>
                <p className="text-gray-500 text-sm">{description}</p>
              </div>

              {/* Right Side: Links (moves below on mobile) */}
              <div className="flex gap-4 text-sm mt-2 md:mt-0">
                <Link href={github} target="_blank">
                  <Github />
                </Link>
                <Link href={live} target="_blank">
                  <LinkIcon />
                </Link>
                <Link
                  href={`/projects/${name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ExternalLink />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
