import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, selectIsAuthenticated } from './store/slices/authSlice';
import { Toaster } from 'react-hot-toast';

// Components
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import MyTemplates from './pages/Templates/MyTemplates';
import PublicTemplates from './pages/Templates/PublicTemplates';
import CreateTemplate from './pages/Templates/CreateTemplate';
import EditTemplate from './pages/Templates/EditTemplate';
import UseTemplate from './pages/Templates/UseTemplate';
import ViewResponses from './pages/Templates/ViewResponses';
import SupportTickets from './pages/Profile/SupportTickets';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="templates">
            <Route index element={<MyTemplates />} />
            <Route path="public" element={<PublicTemplates />} />
            <Route path="create" element={<CreateTemplate />} />
            <Route path="edit/:id" element={<EditTemplate />} />
            <Route path="use/:id" element={<UseTemplate />} />
            <Route path="responses/:id" element={<ViewResponses />} />
          </Route>
          <Route path="support-tickets" element={<SupportTickets />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
