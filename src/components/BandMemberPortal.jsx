import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, Calendar } from 'lucide-react';

// Placeholder for chat UI and calendar UI
const BandMemberPortal = () => {
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [bandMembers, setBandMembers] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);

  // Centralized refresh for availability
  const refreshAvailability = async () => {
    const { data: availabilityData } = await supabase.from('availability').select('*');
    setAvailability(availabilityData || []);
  };

  // Centralized refresh for bookings
  const refreshBookings = async () => {
    const { data: bookingsData } = await supabase.from('bookings').select('*').order('date', { ascending: true });
    setBookings(bookingsData || []);
  };

  useEffect(() => {
    setLoading(true);
    const fetchMembers = async () => {
      const { data } = await supabase.from('band_members').select('*');
      setBandMembers(data || []);
      if (data && data.length > 0) setCurrentMember(data[0]); // Use first member for demo
    };
    Promise.all([refreshBookings(), refreshAvailability(), fetchMembers()]).then(() => setLoading(false));
  }, []);

  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');

  const handleSendMessage = async () => {
    if (!newMessage.trim() || chatLoading) return;
    setChatMessages([...chatMessages, { sender: 'me', text: newMessage, timestamp: new Date() }]);
    setChatError('');
    setChatLoading(true);
    try {
      // Use the first band member as the current user for demo
      const bandMemberId = currentMember ? currentMember.id : null;
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          sender_email: currentMember ? currentMember.email : 'bandmember@example.com',
          sender_name: currentMember ? currentMember.name : 'Band Member',
          band_member_id: bandMemberId
        })
      });
      const data = await response.json();
      if (response.ok && data.response) {
        setChatMessages(msgs => [...msgs, { sender: 'agent', text: data.response, timestamp: new Date() }]);
        await refreshAvailability();
      } else {
        setChatMessages(msgs => [...msgs, { sender: 'agent', text: data.response || 'Sorry, I could not process that.', timestamp: new Date() }]);
      }
    } catch (err) {
      setChatError('Error contacting agent.');
    }
    setNewMessage('');
    setChatLoading(false);
  };

  // Manual add/edit/delete UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    date_range_start: '',
    date_range_end: '',
    status: 'unavailable',
    notes: ''
  });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [availError, setAvailError] = useState('');
  const [availLoading, setAvailLoading] = useState(false);

  // Add new availability
  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setAvailError('');
    setAvailLoading(true);
    // TODO: Replace with real band_member_id from auth/session
    const band_member_id = null;
    if (!addForm.date_range_start || !addForm.date_range_end) {
      setAvailError('Please select a start and end date.');
      setAvailLoading(false);
      return;
    }
    const { error } = await supabase.from('availability').insert([
      {
        band_member_id,
        date_range_start: addForm.date_range_start,
        date_range_end: addForm.date_range_end,
        status: 'unavailable',
        notes: addForm.notes
      }
    ]);
    if (error) setAvailError(error.message);
    setShowAddForm(false);
    setAddForm({ date_range_start: '', date_range_end: '', status: 'unavailable', notes: '' });
    await refreshAvailability();
    setAvailLoading(false);
  };

  // Edit availability
  const handleEditAvailability = async (e) => {
    e.preventDefault();
    setAvailError('');
    setAvailLoading(true);
    if (!editForm.date_range_start || !editForm.date_range_end) {
      setAvailError('Please select a start and end date.');
      setAvailLoading(false);
      return;
    }
    const { error } = await supabase.from('availability').update({
      date_range_start: editForm.date_range_start,
      date_range_end: editForm.date_range_end,
      status: 'unavailable',
      notes: editForm.notes
    }).eq('id', editId);
    if (error) setAvailError(error.message);
    setEditId(null);
    setEditForm({});
    await refreshAvailability();
    setAvailLoading(false);
  };

  // Delete availability
  const handleDeleteAvailability = async (id) => {
    setAvailLoading(true);
    await supabase.from('availability').delete().eq('id', id);
    await refreshAvailability();
    setAvailLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Chat Section */}
      <div className="flex-1 bg-dark/40 rounded-xl p-6 min-h-[400px]">
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-lg">
          <MessageSquare size={20} /> Chat with Agent
        </div>
        <div className="flex flex-col gap-2 h-64 overflow-y-auto bg-dark/20 rounded p-2 mb-4">
          {chatMessages.length === 0 ? (
            <div className="text-light/50">No messages yet.</div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`text-sm ${msg.sender === 'me' ? 'text-right text-primary' : 'text-light'}`}>{msg.text}</div>
            ))
          )}
        </div>
        <div className="text-light/60 text-xs mb-2">Tell the agent when you are <b>not available</b> (e.g., "I'm out March 10-15"). All other dates are assumed available.</div>
        <div className="flex gap-2">
          <input
            className="flex-1 bg-dark/60 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type when you are not available..."
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            disabled={chatLoading}
          />
          <button className="btn-primary" onClick={handleSendMessage} disabled={chatLoading}>
            {chatLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {chatError && <div className="text-red-400 text-xs mt-2">{chatError}</div>}
      </div>
      {/* Bookings & Availability Section */}
      <div className="flex-1 bg-dark/40 rounded-xl p-6 min-h-[400px]">
        <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-lg">
          <Calendar size={20} /> Upcoming Bookings
        </div>
        <ul className="mb-6">
          {loading ? (
            <li className="text-light/50">Loading...</li>
          ) : bookings.length === 0 ? (
            <li className="text-light/50">No upcoming bookings.</li>
          ) : (
            bookings.map((b, idx) => (
              <li key={idx} className="mb-2 text-light/90">
                {b.date} — {b.venue || 'TBD'}
              </li>
            ))
          )}
        </ul>
        <div className="mb-2 text-primary font-semibold flex items-center justify-between">
          <span>Block Out Dates (When You Are Not Available)</span>
          <button className="btn-secondary text-xs py-1 px-3" onClick={() => setShowAddForm(f => !f)} disabled={availLoading}>
            {showAddForm ? 'Cancel' : 'Add'}
          </button>
        </div>
        {showAddForm && (
          <form className="mb-4 flex flex-col gap-2 bg-dark/30 p-3 rounded" onSubmit={handleAddAvailability}>
            <div className="flex gap-2">
              <input type="date" className="flex-1 bg-dark/60 border border-primary/20 rounded px-2 py-1 text-light" value={addForm.date_range_start} onChange={e => setAddForm(f => ({ ...f, date_range_start: e.target.value }))} required />
              <input type="date" className="flex-1 bg-dark/60 border border-primary/20 rounded px-2 py-1 text-light" value={addForm.date_range_end} onChange={e => setAddForm(f => ({ ...f, date_range_end: e.target.value }))} required />
            </div>
            <input type="text" className="bg-dark/60 border border-primary/20 rounded px-2 py-1 text-light" placeholder="Notes (optional)" value={addForm.notes} onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))} />
            <button className="btn-primary mt-1" type="submit" disabled={availLoading}>Add Block Out</button>
            {availError && <div className="text-red-400 text-xs mt-1">{availError}</div>}
          </form>
        )}
        <ul className="space-y-2">
          {availability.map((a, idx) => {
            // Find the band member name for this availability
            const member = bandMembers.find(m => m.id === a.band_member_id);
            const memberName = member ? member.name : 'Unknown Member';
            return (
              <li key={a.id || idx} className="bg-dark/30 rounded p-2 flex items-center gap-2 text-light/90">
                {editId === a.id ? (
                  <form className="flex-1 flex gap-2" onSubmit={handleEditAvailability}>
                    <input type="date" className="flex-1 bg-dark/60 border border-primary/20 rounded px-2 py-1 text-light" value={editForm.date_range_start} onChange={e => setEditForm(f => ({ ...f, date_range_start: e.target.value }))} required />
                    <input type="date" className="flex-1 bg-dark/60 border border-primary/20 rounded px-2 py-1 text-light" value={editForm.date_range_end} onChange={e => setEditForm(f => ({ ...f, date_range_end: e.target.value }))} required />
                    <input type="text" className="bg-dark/60 border border-primary/20 rounded px-2 py-1 text-light" placeholder="Notes" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                    <button className="btn-primary px-3" type="submit" disabled={availLoading}>Save</button>
                    <button className="btn-secondary px-3" type="button" onClick={() => { setEditId(a.id); setEditForm({}); }}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <span className="flex-1">{memberName}: {a.date_range_start} to {a.date_range_end}{a.notes ? ` (${a.notes})` : ''}</span>
                    <button className="btn-secondary text-xs px-2" onClick={() => { setEditId(a.id); setEditForm({ date_range_start: a.date_range_start, date_range_end: a.date_range_end, notes: a.notes || '' }); }} disabled={availLoading}>Edit</button>
                    <button className="btn-primary text-xs px-2 bg-red-600 hover:bg-red-700" onClick={() => handleDeleteAvailability(a.id)} disabled={availLoading}>Delete</button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BandMemberPortal;
