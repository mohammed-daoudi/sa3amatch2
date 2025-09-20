import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageLoadingProps {
  text?: string;
  showSkeleton?: boolean;
  skeletonType?: 'cards' | 'list' | 'table' | 'form';
}

const PageLoading: React.FC<PageLoadingProps> = ({
  text = 'Loading...',
  showSkeleton = false,
  skeletonType = 'cards'
}) => {
  if (showSkeleton) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {skeletonType === 'cards' && (
            <>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow">
                    <div className="h-48 bg-gray-200 rounded-t-lg mb-4"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {skeletonType === 'list' && (
            <>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {skeletonType === 'table' && (
            <>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-12 bg-gray-100 border-b"></div>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div key={index} className="h-16 border-b border-gray-200 px-4 flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {skeletonType === 'form' && (
            <>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                  <div className="flex justify-end space-x-2 pt-4">
                    <div className="h-10 w-20 bg-gray-200 rounded"></div>
                    <div className="h-10 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

export default PageLoading;
