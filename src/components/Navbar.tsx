import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center p-4">
      <div className="w-full max-w-3/4 lg:w-3/4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">
            <span>rahularora.tech</span>
          </Link>
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
