import React from 'react';
import { Link } from 'react-router-dom';

const TemplateList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Link
          to="/templates/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Create Template
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Your templates will be listed here</p>
      </div>
    </div>
  );
};

export default TemplateList;
