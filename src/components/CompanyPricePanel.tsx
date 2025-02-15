import React, { useState } from 'react';
import { Property } from '../types';
import { DollarSign, Search } from 'lucide-react';

interface CompanyPricePanelProps {
  properties: Property[];
  onUpdatePropertyPrice: (propertyId: number, newPrice: number, newRent: number) => void;
}

export const CompanyPricePanel: React.FC<CompanyPricePanelProps> = ({
  properties,
  onUpdatePropertyPrice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProperty, setEditingProperty] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [newRent, setNewRent] = useState<string>('');

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdatePrice = (propertyId: number) => {
    const price = parseInt(newPrice);
    const rent = parseInt(newRent);
    
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    if (isNaN(rent) || rent <= 0) {
      alert('Please enter a valid rent amount');
      return;
    }

    onUpdatePropertyPrice(propertyId, price, rent);
    setEditingProperty(null);
    setNewPrice('');
    setNewRent('');
  };

  const startEditing = (property: Property) => {
    setEditingProperty(property.id);
    setNewPrice(property.price.toString());
    setNewRent(property.rent.toString());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Company Price Management</h3>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="grid gap-4">
        {filteredProperties.map(property => (
          <div
            key={property.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{property.name}</h4>
                {editingProperty !== property.id ? (
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>Price: ${property.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} />
                      <span>Rent: ${property.rent}/turn</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mt-2">
                    <div>
                      <label className="text-sm text-gray-600 block">New Price:</label>
                      <input
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-32 px-2 py-1 border rounded text-sm"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block">New Rent:</label>
                      <input
                        type="number"
                        value={newRent}
                        onChange={(e) => setNewRent(e.target.value)}
                        className="w-32 px-2 py-1 border rounded text-sm"
                        min="1"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div>
                {editingProperty !== property.id ? (
                  <button
                    onClick={() => startEditing(property)}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors text-sm"
                  >
                    Edit Price
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleUpdatePrice(property.id)}
                      className="bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingProperty(null)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};