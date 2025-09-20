import React from 'react';
import { fieldsAPI } from '../lib/api';
import { Field } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import FieldCard from '../components/fields/FieldCard';
import FieldMap from '../components/map/FieldMap';
import PageLoading from '../components/ui/PageLoading';
import toast from 'react-hot-toast';

const FieldsPage: React.FC = () => {
  const [fields, setFields] = React.useState<Field[]>([]);
  const [filteredFields, setFilteredFields] = React.useState<Field[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list');

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fieldsData = await fieldsAPI.getFields();
      setFields(fieldsData);
      setFilteredFields(fieldsData);
    } catch (error) {
      console.error('Error fetching fields:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load fields';
      setError(errorMessage);
      toast.error('Failed to load fields. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFields();
  }, []);

  React.useEffect(() => {
    const filtered = fields.filter((field) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        field.name.toLowerCase().includes(searchLower) ||
        field.address.toLowerCase().includes(searchLower) ||
        field.description.toLowerCase().includes(searchLower)
      );
    });

    setFilteredFields(filtered);
  }, [searchTerm, fields]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Football Fields</h1>
          <p className="text-gray-600">
            {filteredFields.length} fields available in Khouribga
          </p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <Input
              type="text"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex rounded-md overflow-hidden border">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-3 py-2 ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">📋</span>
              <span className="text-sm">List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-3 py-2 ${
                viewMode === 'map'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">🗺️</span>
              <span className="text-sm">Map</span>
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <PageLoading showSkeleton={true} skeletonType="cards" />
      ) : error ? (
        <div className="text-center py-16">
          <div className="mx-auto text-5xl text-red-400 mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">Failed to load fields</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetchFields();
            }}
          >
            Try Again
          </Button>
        </div>
      ) : filteredFields.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto text-5xl text-gray-400 mb-4">📍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">No fields found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any fields matching your search.
          </p>
          <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      ) : (
        <div className="h-[calc(100vh-250px)] min-h-[500px] rounded-lg overflow-hidden">
          <FieldMap fields={filteredFields} height="100%" />
        </div>
      )}
    </div>
  );
};

export default FieldsPage;
