'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  department: string;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, San Francisco, CA 94105',
    position: 'Senior Sales Manager',
    department: 'Sales',
  });
  const [tempProfile, setTempProfile] = useState<ProfileData>({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const renderField = (label: string, value: string, icon: React.ReactNode, field: keyof ProfileData) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={tempProfile[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <div className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md bg-gray-50">
            {value}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500">{profile.position}</p>
                <p className="text-sm text-gray-500">{profile.department}</p>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              {renderField('Full Name', profile.name, <User className="h-5 w-5 text-gray-400" />, 'name')}
              {renderField('Email', profile.email, <Mail className="h-5 w-5 text-gray-400" />, 'email')}
              {renderField('Phone', profile.phone, <Phone className="h-5 w-5 text-gray-400" />, 'phone')}
              {renderField('Address', profile.address, <MapPin className="h-5 w-5 text-gray-400" />, 'address')}
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                  <p className="text-sm text-gray-500 mt-1">Update your password regularly to keep your account secure.</p>
                  <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
