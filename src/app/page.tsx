import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';

const socialLinks = [
  {
    href: 'https://github.com/rahularora27',
    icon: <Github />,
  },
  { href: 'https://x.com/_rahul27', icon: <Twitter /> },
  {
    href: 'https://www.linkedin.com/in/rahularora2715/',
    icon: <Linkedin />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold gap-2">Oh, hello there 👋</h1>
        <div className="space-y-2 text-lg">
          <p>
            👨‍🎓 I’m Rahul Arora, a 22-year-old final year student at Manipal
            University.
          </p>
          <p>👨‍💻 I love math and cs.</p>
          <p>⚒️ Currently working at Rakuten</p>
          <p>🏡 Currently living in the beautiful city of Chandigarh, India.</p>
        </div>
        <div className="flex gap-4 mt-4">
          {socialLinks.map(({ href, icon }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
