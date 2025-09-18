import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderRoot as Football } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Football className="h-24 w-24 text-primary-500 animate-bounce-slow" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;