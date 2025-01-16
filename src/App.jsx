import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import FormBuilder from './pages/FormBuilder/FormBuilder';
import Profile from './pages/Profile/Profile';
import Templates from './pages/Templates/Templates';
import { loadUser } from './store/slices/authSlice';

import './App.css';

function App() {
  const dispatch = useDispatch();

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="form-builder" element={<FormBuilder />} />
          <Route path="templates" element={<Templates />} />
          <Route path="profile/*" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
