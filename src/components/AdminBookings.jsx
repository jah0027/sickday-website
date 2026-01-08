import React, { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, XCircle, Clock, Mail, Calendar, DollarSign } from 'lucide-react'
import { supabase } from '../lib/supabase'

const AdminBookings = () => {
  const [conversations, setConversations] = useState([])
  const [showArchived, setShowArchived] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    event_date: '',
    event_time: '',
    venue_name: '',
    contact_name: '',
    contact_email: '',
    estimated_attendance: '',
    amount: 1500,
    notes: ''
  })

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('Fetched conversations:', data)
    console.log('Error:', error)
    
    if (data) {
      setConversations(data)
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0])
      }
    }
    setLoading(false)
  }

  const deleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry? This cannot be undone.')) return;
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);
    if (error) {
      alert('Error deleting inquiry: ' + error.message);
    } else {
      setConversations(conversations => conversations.filter(c => c.id !== conversationId));
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(null);
      }
    }
  }

  const fetchMessages = async (conversationId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    if (data) {
      setMessages(data)
    }
  }

  const updateConversationStatus = async (conversationId, status) => {
    await supabase
      .from('conversations')
      .update({ status })
      .eq('id', conversationId)
    
    fetchConversations()
  }

  const openBookingForm = () => {
    const participant = getParticipantInfo(selectedConversation)
    setBookingForm({
      event_date: '',
      event_time: '19:00',
      venue_name: participant.venue_name || '',
      contact_name: participant.name,
      contact_email: participant.email,
      estimated_attendance: '',
      amount: 1500,
      notes: ''
    })
    setShowBookingForm(true)
  }

  const createBooking = async (e) => {
    e.preventDefault()
    
    // Create booking in database
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        conversation_id: selectedConversation.id,
        event_date: bookingForm.event_date,
        event_time: bookingForm.event_time,
        venue_name: bookingForm.venue_name,
        contact_name: bookingForm.contact_name,
        contact_email: bookingForm.contact_email,
        estimated_attendance: bookingForm.estimated_attendance ? parseInt(bookingForm.estimated_attendance) : null,
        payment_amount: parseFloat(bookingForm.amount),
        status: 'pending_approval',
        state: 'inquiry',
        notes: bookingForm.notes
      })
      .select()
      .single()
    
    if (booking) {
      // Update conversation status to resolved
      await updateConversationStatus(selectedConversation.id, 'resolved')
      setShowBookingForm(false)
      alert('Booking created successfully!')
    } else if (error) {
      alert('Error creating booking: ' + error.message)
    }
  }

  const getParticipantInfo = (conversation) => {
    if (!conversation.participants) return { name: 'Unknown', email: 'Unknown', type: 'unknown' }
    const venue = conversation.participants.find(p => p.type === 'venue')
    return venue || conversation.participants[0]
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="text-yellow-500" size={16} />
      case 'resolved':
        return <CheckCircle className="text-green-500" size={16} />
      case 'archived':
        return <XCircle className="text-gray-500" size={16} />
      default:
        return <MessageSquare className="text-blue-500" size={16} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-light mb-6">Create Booking</h3>
            <form onSubmit={createBooking} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-light/80 mb-2">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.event_date}
                    onChange={(e) => setBookingForm({...bookingForm, event_date: e.target.value})}
                    className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  />
                </div>
                <div>
                  <label className="block text-light/80 mb-2">Event Time *</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.event_time}
                    onChange={(e) => setBookingForm({...bookingForm, event_time: e.target.value})}
                    className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-light/80 mb-2">Venue Name *</label>
                <input
                  type="text"
                  required
                  value={bookingForm.venue_name}
                  onChange={(e) => setBookingForm({...bookingForm, venue_name: e.target.value})}
                  className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-light/80 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.contact_name}
                    onChange={(e) => setBookingForm({...bookingForm, contact_name: e.target.value})}
                    className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  />
                </div>
                <div>
                  <label className="block text-light/80 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={bookingForm.contact_email}
                    onChange={(e) => setBookingForm({...bookingForm, contact_email: e.target.value})}
                    className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-light/80 mb-2">Expected Attendance</label>
                  <input
                    type="number"
                    value={bookingForm.estimated_attendance}
                    onChange={(e) => setBookingForm({...bookingForm, estimated_attendance: e.target.value})}
                    className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  />
                </div>
                <div>
                  <label className="block text-light/80 mb-2">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={bookingForm.amount}
                    onChange={(e) => setBookingForm({...bookingForm, amount: e.target.value})}
                    className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-light/80 mb-2">Notes</label>
                <textarea
                  rows="3"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                  className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
                  placeholder="Additional details about the booking..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Create Booking
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-dark/50 rounded-2xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-light">Booking Inquiries</h3>
            <button
              onClick={() => setShowArchived((v) => !v)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${showArchived ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-700 border-gray-600 text-light/70 hover:bg-primary/10 hover:text-primary'}`}
            >
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
          </div>
          <div className="space-y-3">
            {conversations
              .filter(c => showArchived ? c.status === 'archived' : c.status !== 'archived')
              .map((conversation) => {
                const participant = getParticipantInfo(conversation)
                return (
                  <motion.div
                    key={conversation.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all relative ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-primary/5 hover:bg-primary/10 border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-light">{participant.name}</h4>
                        <p className="text-sm text-light/60">{participant.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(conversation.status)}
                        <button
                          title="Delete permanently"
                          onClick={e => { e.stopPropagation(); deleteConversation(conversation.id); }}
                          className="ml-2 p-1 rounded hover:bg-red-700/30 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-light/50">
                      {new Date(conversation.created_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                )
              })}
          </div>
        </div>

        {/* Conversation Details */}
        <div className="lg:col-span-2 bg-dark/50 rounded-2xl flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-light">
                    {getParticipantInfo(selectedConversation).name}
                  </h3>
                  <p className="text-light/60">
                    {getParticipantInfo(selectedConversation).email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateConversationStatus(selectedConversation.id, 'resolved')}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => updateConversationStatus(selectedConversation.id, 'archived')}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Archive
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full ${
                  selectedConversation.status === 'active' ? 'bg-yellow-500/20 text-yellow-500' :
                  selectedConversation.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {selectedConversation.status}
                </span>
                <span className="text-light/60">
                  Started {new Date(selectedConversation.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender_type === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender_type === 'agent'
                      ? 'bg-primary/10'
                      : 'bg-gradient-to-r from-primary to-secondary'
                  } rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-semibold ${
                        message.sender_type === 'agent' ? 'text-primary' : 'text-white'
                      }`}>
                        {message.sender_name}
                      </span>
                      <span className={`text-xs ${
                        message.sender_type === 'agent' ? 'text-light/50' : 'text-white/70'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={`text-sm whitespace-pre-wrap ${
                      message.sender_type === 'agent' ? 'text-light' : 'text-white'
                    }`}>
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sticky Action Buttons */}
            <div className="sticky bottom-0 left-0 w-full bg-dark/80 p-6 border-t border-primary/20 z-20 flex gap-3" style={{backdropFilter: 'blur(6px)'}}>
              <a
                href={`mailto:${getParticipantInfo(selectedConversation).email}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
              >
                <Mail size={16} />
                Send Email
              </a>
              <button
                onClick={openBookingForm}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-white rounded-lg transition-colors"
              >
                <Calendar size={16} />
                Create Booking
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-light/50">
            Select a conversation to view details
          </div>
        )}
        </div>
      </div>
    </>
  )
}

export default AdminBookings
