import Link from 'next/link';
import ThemeSwitcher from './ui/theme-button';

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center p-4">
      <div className="w-full max-w-3/4 lg:w-3/4 flex justify-between items-center">
        <div className="flex gap-2 text-2xl font-bold">
          <Link href="/">rahularora.tech</Link>
          <ThemeSwitcher />
        </div>
        <div>
          <Link href="/projects" className="text-lg">
            Projects
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
