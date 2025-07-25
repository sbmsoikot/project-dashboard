import React, { useState } from 'react';
import type { Manpower, UserRole } from '../types';

interface ManpowerTableProps {
  role: UserRole;
  manpower: Manpower[];
  onAdd: (manpower: Partial<Manpower>) => Promise<void>;
  onUpdate: (manpowerId: number, updates: Partial<Manpower>) => Promise<void>;
  onDelete: (manpowerId: number) => Promise<void>;
}

export default function ManpowerTable({ role, manpower, onAdd, onUpdate, onDelete }: ManpowerTableProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; manpowerType: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    manpower_type: '',
    engaged_to: '',
    number_of_manpower: '1',
    perday_cost: ''
  });

  const manpowerTypes = ['Admin', 'Engineer', 'Supervisor', 'Labour'];
  const workTypes = ['General', 'Brick Work', 'Structure Work', 'Plaster Work', 'Electric Work', 'Painting'];

  // No need to fetch manpower locally since it's passed as props

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        date: new Date(formData.date).toISOString(),
        manpower_type: formData.manpower_type,
        engaged_to: formData.engaged_to,
        number_of_manpower: parseInt(formData.number_of_manpower),
        perday_cost: formData.perday_cost ? parseInt(formData.perday_cost) : undefined
      };

      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onAdd(payload);
      }
      
      resetForm();
    } catch (error) {
      console.error('Failed to save manpower:', error);
    }
  };

  const handleEdit = (record: Manpower) => {
    setEditingId(record.id);
    setFormData({
      date: record.date.split('T')[0],
      manpower_type: record.manpower_type,
      engaged_to: record.engaged_to,
      number_of_manpower: record.number_of_manpower.toString(),
      perday_cost: record.perday_cost?.toString() || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: number, manpowerType: string) => {
    setDeleteConfirm({ id, manpowerType });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    
    try {
      await onDelete(deleteConfirm.id);
    } catch (error) {
      console.error('Failed to delete manpower:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      manpower_type: '',
      engaged_to: '',
      number_of_manpower: '1',
      perday_cost: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const formatDate = (dateString: string) => {
    // Parse date string (YYYY-MM-DDTHH:MM:SS) and format as DD/MM/YYYY
    const date = dateString.split('T')[0]; // Get YYYY-MM-DD part
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  // Loading is handled by parent component

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Manpower Management</h2>
        {role === 'admin' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Manpower
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Manpower Record' : 'Add New Manpower Record'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manpower Type</label>
                <select
                  value={formData.manpower_type}
                  onChange={(e) => setFormData({ ...formData, manpower_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  {manpowerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engaged To</label>
                <select
                  value={formData.engaged_to}
                  onChange={(e) => setFormData({ ...formData, engaged_to: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Work Type</option>
                  {workTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Manpower</label>
                <input
                  type="number"
                  value={formData.number_of_manpower}
                  onChange={(e) => setFormData({ ...formData, number_of_manpower: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Per Day Cost (Optional)</label>
                <input
                  type="number"
                  value={formData.perday_cost}
                  onChange={(e) => setFormData({ ...formData, perday_cost: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter cost per day"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Record
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Manpower Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Manpower Type</th>
              <th className="px-4 py-2 text-left">Engaged To</th>
              <th className="px-4 py-2 text-center">Number</th>
              <th className="px-4 py-2 text-center">Per Day Cost</th>
              {role === 'admin' && <th className="px-4 py-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {manpower.map((record) => (
              <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{formatDate(record.date)}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {record.manpower_type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {record.engaged_to}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    {record.number_of_manpower}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {record.perday_cost ? `$${record.perday_cost.toLocaleString()}` : '-'}
                </td>
                {role === 'admin' && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.id, record.manpower_type)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the manpower record for <span className="font-semibold">"{deleteConfirm.manpowerType}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 