import React from 'react';
import { Link } from 'react-router-dom';

const FormList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Forms</h1>
        <Link
          to="/forms/builder"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create New Form
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Your forms will be listed here</p>
      </div>
    </div>
  );
};

export default FormList;
