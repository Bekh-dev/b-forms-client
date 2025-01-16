import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserTickets } from '../../services/jiraService';
import { selectUser } from '../../store/slices/authSlice';

const TicketsList = () => {
  const user = useSelector(selectUser);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadTickets = async () => {
    try {
      const response = await getUserTickets(user.email, page * 10);
      if (response.issues.length < 10) {
        setHasMore(false);
      }
      setTickets(prev => page === 0 ? response.issues : [...prev, ...response.issues]);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 0) {
    return <div className="text-center py-4">Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Your Support Tickets</h2>
      
      {tickets.length === 0 ? (
        <p className="text-gray-600">No tickets found</p>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">
                  <a 
                    href={`${import.meta.env.VITE_JIRA_DOMAIN}/browse/${ticket.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {ticket.fields.summary}
                  </a>
                </h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  ticket.fields.priority.name === 'High' ? 'bg-red-100 text-red-800' :
                  ticket.fields.priority.name === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {ticket.fields.priority.name}
                </span>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Status: {ticket.fields.status.name}
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(ticket.fields.created).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketsList;
