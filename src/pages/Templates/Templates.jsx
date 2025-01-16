import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TemplateList from './TemplateList';
import CreateTemplate from './CreateTemplate';
import EditTemplate from './EditTemplate';
import ViewTemplate from './ViewTemplate';

const Templates = () => {
  return (
    <Routes>
      <Route index element={<TemplateList />} />
      <Route path="create" element={<CreateTemplate />} />
      <Route path="edit/:id" element={<EditTemplate />} />
      <Route path="view/:id" element={<ViewTemplate />} />
    </Routes>
  );
};

export default Templates;
