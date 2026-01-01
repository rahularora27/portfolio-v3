const socialLinks = [
  {
    href: 'https://github.com/rahularora27',
    name: 'Github'
  },
  {
    href: 'https://www.linkedin.com/in/rahularora2715/',
    name: 'Linkedin'
  },
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold gap-2 text-gray-900 dark:text-white">Oh, hello there 👋</h1>
        <div className="space-y-2 text-lg text-gray-800 dark:text-gray-200">
          <p>
            👨‍🎓 I&apos;m Rahul Arora, a recent graduate from Manipal University.
          </p>
          {/* <p>👨‍💻 A part-time cricketer and a lover of math and CS.</p> */}
          <p>👨‍💻 Currently working at <a
            href="https://global.rakuten.com/corp/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-link-hover underline"
          >Rakuten</a>.</p>
          <p>⚒️ I mainly work with Java and React on a daily basis.</p>
          <p>🏡 Currently living in the beautiful city of Bengaluru, India.</p>
        </div>
        <div className="flex gap-4 mt-4">
          {socialLinks.map(({ href, name }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-100 hover:text-link-hover dark:hover:text-link-hover"
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
