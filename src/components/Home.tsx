const socialLinks = [
  {
    href: 'https://github.com/rahularora27',
    text: 'Github',
  },
  {
    href: 'https://www.linkedin.com/in/rahularora2715/',
    text: 'LinkedIn',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center flex-grow p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold gap-2 text-gray-900 dark:text-white">Oh, hello there 👋</h1>
        <div className="space-y-2 text-lg text-gray-800 dark:text-gray-200">
          <p>
            👨‍🎓 I&apos;m Rahul Arora.
          </p>
          {/* <p>👨‍💻 A part-time cricketer and a lover of math and CS.</p> */}
          <p>🎓 Recently graduated from Manipal University Jaipur.</p>
          <p>⚒️ I&apos;m currently working at Rakuten India.</p>
          <p>🏡 Currently living in the beautiful city of Bengaluru, India.</p>
        </div>
        <div className="flex gap-4 mt-4">
          {socialLinks.map(({ href, text }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
