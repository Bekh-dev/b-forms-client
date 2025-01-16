import React from 'react';
import TicketsList from '../../components/JiraTicket/TicketsList';

const SupportTickets = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Support Tickets</h1>
      <div className="bg-white rounded-lg p-6">
        <TicketsList />
      </div>
    </div>
  );
};

export default SupportTickets;
