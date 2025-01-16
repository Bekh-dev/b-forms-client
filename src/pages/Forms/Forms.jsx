import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FormBuilder from './FormBuilder';
import FormList from './FormList';

const Forms = () => {
  return (
    <Routes>
      <Route index element={<FormList />} />
      <Route path="builder" element={<FormBuilder />} />
      <Route path="builder/:id" element={<FormBuilder />} />
    </Routes>
  );
};

export default Forms;
