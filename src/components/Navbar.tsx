
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-center items-center p-4">
      <div className="w-full lg:w-3/4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">rahularora.tech</Link>
        </div>
          <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
      </div>
    </nav>
  );
};

export default Navbar;