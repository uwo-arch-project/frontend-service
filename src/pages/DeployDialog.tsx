// DialogForm.tsx
import React, { useState } from 'react';

interface DialogProps {
  isOpen: boolean;
  repo_scout_id: string;
  image: string;
  onClose: () => void;
  onSubmit: (formData: { field1: string; field2: string }) => void;
}

const DeployDialog: React.FC<DialogProps> = ({ isOpen, onClose, repo_scout_id, image, onSubmit }) => {
  const [field1,] = useState('');
  const [field2,] = useState('');

  const [field3, setField3] = useState('');
  const [field4, setField4] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ field1, field2 });
    onClose(); // Close the dialog after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Create a Deployment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="field1">
              Repo Scout ID
            </label>
            <input
              type="text"
              id="field1"
              value={repo_scout_id}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="field2">
              Image
            </label>
            <input
              type="text"
              id="field2"
              value={image}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="field3">
              Name
            </label>
            <input
              type="text"
              id="field3"
              value={field3}
              onChange={(e) => setField3(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="field4">
              Port Number
            </label>
            <input
              type="text"
              id="field4"
              value={field4}
              onChange={(e) => setField4(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeployDialog;
