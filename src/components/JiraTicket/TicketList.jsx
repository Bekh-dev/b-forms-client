import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserTickets } from '../../services/jiraService';
import { selectUser } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import './TicketList.css';

const TicketList = () => {
  const user = useSelector(selectUser);
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.email) {
        setLoading(false);
        setError('Please log in to view tickets');
        return;
      }

      try {
        console.log('Fetching tickets for user:', user.email);
        const response = await getUserTickets(user.email);
        console.log('Tickets response:', response);
        
        if (!response) {
          throw new Error('No response from server');
        }

        setTickets(response.tickets || []);
        setTotal(response.total || 0);
        setError(null);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError(error.message || 'Failed to fetch tickets');
        toast.error(error.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="ticket-list-container">
        <div className="ticket-list-loading">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-list-container">
        <div className="ticket-list-error">{error}</div>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="ticket-list-container">
        <h2>Your Support Tickets (0)</h2>
        <div className="ticket-list-empty">No tickets found</div>
      </div>
    );
  }

  return (
    <div className="ticket-list-container">
      <h2>Your Support Tickets ({total})</h2>
      <div className="ticket-list">
        {tickets.map(ticket => (
          <div key={ticket.id} className="ticket-item">
            <div className="ticket-header">
              <h3>{ticket.summary}</h3>
              <span className={`ticket-priority priority-${ticket.priority?.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>
            <div className="ticket-status">
              Status: <span className={`status-${ticket.status?.toLowerCase()}`}>{ticket.status}</span>
            </div>
            <div className="ticket-dates">
              <div>Created: {new Date(ticket.created).toLocaleString()}</div>
              <div>Updated: {new Date(ticket.updated).toLocaleString()}</div>
            </div>
            {ticket.description && (
              <div className="ticket-description">{ticket.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
