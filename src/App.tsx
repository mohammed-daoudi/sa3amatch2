import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed Navbar Component */}
        <Navbar />

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl">⚽</span>
                <span className="ml-2 text-xl font-bold">Sa3aMatch</span>
              </div>
              <p className="text-gray-400 mb-4">
                The best platform for booking football fields in Khouribga
              </p>
              <p className="text-gray-500 text-sm">
                © 2025 Sa3aMatch. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
