import React, { useEffect, useState } from 'react';
import { getUserTickets } from '../../services/jiraService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './TicketList.css';

const TicketList = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUserTickets(user.email);
        setTickets(response.tickets);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user?.email]);

  if (loading) {
    return <div className="ticket-list-loading">Loading tickets...</div>;
  }

  if (!user?.email) {
    return <div className="ticket-list-error">Please log in to view tickets</div>;
  }

  if (tickets.length === 0) {
    return <div className="ticket-list-empty">No tickets found</div>;
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
              <div>Created: {ticket.created}</div>
              <div>Updated: {ticket.updated}</div>
            </div>
            <div className="ticket-description">{ticket.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
