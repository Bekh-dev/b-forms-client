import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import Header from '../header/Header';
import CreateTicket from '../JiraTicket/CreateTicket';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadUser()).unwrap()
        .catch(() => {
          navigate('/login');
        });
    }
  }, [dispatch, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Help Button */}
      <button
        onClick={() => setShowTicketModal(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Get Help"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Ticket Modal */}
      {showTicketModal && (
        <CreateTicket
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};

export default Layout;