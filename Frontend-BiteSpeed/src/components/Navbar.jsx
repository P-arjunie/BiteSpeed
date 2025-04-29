// components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="w-full bg-black text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-orange-500">🍴 BiteSpeed</h1>
        <nav className="space-x-4 hidden sm:block">
          <Link to="/customer-home" className="text-orange-400 font-semibold underline">
            Home
          </Link>
          <Link to="/orders" className="hover:text-orange-400">
            My Orders
          </Link>
          <Link to="/customer-profile" className="hover:text-orange-400">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;