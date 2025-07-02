import { IconBrandGithub, IconBrandLinkedin, IconBrandX } from '@tabler/icons-react';

const socialLinks = [
  {
    href: 'https://github.com/rahularora27',
    icon: <IconBrandGithub />,
  },
  {
    href: 'https://x.com/_rahul27',
    icon: <IconBrandX />
  },
  {
    href: 'https://www.linkedin.com/in/rahularora2715/',
    icon: <IconBrandLinkedin />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold gap-2">Oh, hello there 👋</h1>
        <div className="space-y-2 text-lg">
          <p>
            👨‍🎓 I&apos;m Rahul Arora, a 22-year-old final year student at Manipal
            University.
          </p>
          <p>👨‍💻 A part-time cricketer and a lover of math and CS.</p>
          <p>⚒️ I&apos;m currently working at Rakuten India.</p>
          <p>🏡 Currently living in the beautiful city of Bengaluru, India.</p>
        </div>
        <div className="flex gap-4 mt-4">
          {socialLinks.map(({ href, icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
