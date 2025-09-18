import React from 'react';
import { Plus, Pencil, Trash2, MapPin, Star } from 'lucide-react';
import { fieldsAPI } from '../../lib/api';
import { Field } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

interface FieldFormData {
  name: string;
  address: string;
  pricePerHour: number;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  rating: number;
  amenities: string[];
}

const AdminFields: React.FC = () => {
  const [fields, setFields] = React.useState<Field[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editingField, setEditingField] = React.useState<Field | null>(null);
  const [formData, setFormData] = React.useState<FieldFormData>({
    name: '',
    address: '',
    pricePerHour: 0,
    description: '',
    imageUrl: '',
    latitude: 32.8959,
    longitude: -6.9190,
    rating: 4.0,
    amenities: [],
  });
  const [amenityInput, setAmenityInput] = React.useState('');

  const fetchFields = async () => {
    try {
      setIsLoading(true);
      const fieldsData = await fieldsAPI.getFields();
      setFields(fieldsData);
    } catch (error) {
      console.error('Error fetching fields:', error);
      toast.error('Failed to load fields');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFields();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      pricePerHour: 0,
      description: '',
      imageUrl: '',
      latitude: 32.8959,
      longitude: -6.9190,
      rating: 4.0,
      amenities: [],
    });
    setAmenityInput('');
    setEditingField(null);
    setShowForm(false);
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      address: field.address,
      pricePerHour: field.pricePerHour,
      description: field.description,
      imageUrl: field.imageUrl,
      latitude: field.latitude,
      longitude: field.longitude,
      rating: field.rating,
      amenities: [...field.amenities],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.address || formData.pricePerHour <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingField) {
        await fieldsAPI.updateField(editingField.id, formData);
        toast.success('Field updated successfully');
      } else {
        await fieldsAPI.createField(formData);
        toast.success('Field created successfully');
      }

      resetForm();
      fetchFields();
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error(editingField ? 'Failed to update field' : 'Failed to create field');
    }
  };

  const handleDelete = async (field: Field) => {
    if (!confirm(`Are you sure you want to delete "${field.name}"?`)) {
      return;
    }

    try {
      await fieldsAPI.deleteField(field.id);
      toast.success('Field deleted successfully');
      fetchFields();
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error('Failed to delete field');
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Field Management</h1>
          <p className="text-gray-600">
            Manage football fields - {fields.length} fields total
          </p>
        </div>

        <Button onClick={() => setShowForm(true)} className="mt-4 md:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Field
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingField ? 'Edit Field' : 'Add New Field'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Field name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price per Hour (MAD) *</label>
                  <Input
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: Number(e.target.value) }))}
                    placeholder="150"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Full address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Field description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Latitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: Number(e.target.value) }))}
                    placeholder="32.8959"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Longitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: Number(e.target.value) }))}
                    placeholder="-6.9190"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    placeholder="4.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Amenities</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Add amenity (e.g., Parking)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  />
                  <Button type="button" onClick={addAmenity} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingField ? 'Update Field' : 'Create Field'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Card key={field.id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={field.imageUrl}
                alt={field.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{field.name}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm">{field.rating}</span>
                </div>
              </div>

              <div className="flex items-start text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{field.address}</span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{field.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {field.amenities.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {amenity}
                  </span>
                ))}
                {field.amenities.length > 3 && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    +{field.amenities.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-primary-600">
                  {field.pricePerHour} MAD/h
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(field)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(field)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-16">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-1">No fields found</h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first field.
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Field
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminFields;
