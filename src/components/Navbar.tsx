
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  const baseUrl = import.meta.env.BASE_URL ?? "/";

  return (
    <nav className="flex justify-center items-center p-4">
      <div className="w-full lg:w-3/4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          <Link to="/" className="text-gray-900 dark:text-white hover:text-link-hover dark:hover:text-link-hover">rahularora</Link>
        </div>
        <div className="flex gap-4 items-center">
          {/* <Link to="/projects" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ">Projects</Link> */}
          <Link to="/blogs" className="text-gray-700 dark:text-gray-300 hover:text-link-hover dark:hover:text-link-hover">Blogs</Link>
          <a
            href={`${baseUrl}resume.pdf`}
            download
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-link-hover dark:hover:text-link-hover"
          >
            Resume
          </a>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
