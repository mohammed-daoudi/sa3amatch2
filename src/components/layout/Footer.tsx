import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Sa3aMatch</h3>
            <p className="text-gray-300 text-sm mb-4">
              Book football fields in Khouribga easily. Check availability, weather, and pay securely.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-xl">
                📘
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-xl">
                📷
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-xl">
                🐦
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/fields" className="text-gray-300 hover:text-white transition">
                  Fields
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-300 hover:text-white transition">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-300 hover:text-white transition">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <span className="text-gray-300">+212 6XX XXX XXX</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <span className="text-gray-300">contact@sa3amatch.ma</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">📍</span>
                <span className="text-gray-300">Avenue Hassan II, Khouribga, Morocco</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              />
              <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sa3aMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
