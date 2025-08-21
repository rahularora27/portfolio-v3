
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center p-4">
      <div className="w-full lg:w-3/4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">rahularora.tech</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <a 
            href="/resume.pdf" 
            download 
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;