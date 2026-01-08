import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, MapPin, Users, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import EditBookingModal from './EditBookingModal'

// Booking form modal for manual creation
const AddBookingModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    event_date: '',
    event_time: '19:00',
    venue_name: '',
    contact_name: '',
    contact_email: '',
    estimated_attendance: '',
    amount: 1500,
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_date: form.event_date,
        event_time: form.event_time,
        venue_name: form.venue_name,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        estimated_attendance: form.estimated_attendance ? parseInt(form.estimated_attendance) : null,
        payment_amount: parseFloat(form.amount),
        status: 'pending_approval',
        state: 'inquiry',
        notes: form.notes
      })
      .select()
      .single()
    setSubmitting(false)
    if (data) {
      onCreated && onCreated()
      onClose()
      alert('Booking created successfully!')
    } else if (error) {
      alert('Error creating booking: ' + error.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-2xl font-bold text-light mb-6">Add Booking</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light/80 mb-2">Event Date *</label>
              <input type="date" required value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
            </div>
            <div>
              <label className="block text-light/80 mb-2">Event Time *</label>
              <input type="time" required value={form.event_time} onChange={e => setForm({ ...form, event_time: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
            </div>
          </div>
          <div>
            <label className="block text-light/80 mb-2">Venue Name *</label>
            <input type="text" required value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light/80 mb-2">Contact Name *</label>
              <input type="text" required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
            </div>
            <div>
              <label className="block text-light/80 mb-2">Contact Email *</label>
              <input type="email" required value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light/80 mb-2">Expected Attendance</label>
              <input type="number" value={form.estimated_attendance} onChange={e => setForm({ ...form, estimated_attendance: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
            </div>
            <div>
              <label className="block text-light/80 mb-2">Amount ($) *</label>
              <input type="number" required step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" />
            </div>
          </div>
          <div>
            <label className="block text-light/80 mb-2">Notes</label>
            <textarea rows="3" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light" placeholder="Additional details about the booking..." />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={submitting} className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">{submitting ? 'Creating...' : 'Create Booking'}</button>
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const AdminBookingsList = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, confirmed, cancelled
  const [editingBooking, setEditingBooking] = useState(null)
  const [showAddBooking, setShowAddBooking] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [filter, showAddBooking])

  const fetchBookings = async () => {
    setLoading(true)
    let query = supabase
      .from('bookings')
      .select('*')
      .order('event_date', { ascending: true, nullsFirst: false })
    
    if (filter !== 'all') {
      query = query.eq('state', filter)
    }
    
    const { data, error } = await query
    
    if (data) {
      setBookings(data)
    }
    if (error) {
      console.error('Error fetching bookings:', error)
    }
    setLoading(false)
  }

  const updateBookingState = async (bookingId, newState) => {
    const { error } = await supabase
      .from('bookings')
      .update({ state: newState })
      .eq('id', bookingId)
    
    if (!error) {
      fetchBookings()
    }
  }

  const handleSaveBooking = (updated) => {
    setBookings((prev) => prev.map(b => b.id === updated.id ? updated : b))
  }

  const getStateColor = (state) => {
    switch (state) {
      case 'inquiry':
        return 'bg-blue-500/20 text-blue-500'
      case 'proposal_sent':
        return 'bg-purple-500/20 text-purple-500'
      case 'negotiating':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'pending_approval':
        return 'bg-orange-500/20 text-orange-500'
      case 'approved':
        return 'bg-green-500/20 text-green-500'
      case 'contract_sent':
        return 'bg-teal-500/20 text-teal-500'
      case 'confirmed':
        return 'bg-emerald-500/20 text-emerald-500'
      case 'cancelled':
        return 'bg-red-500/20 text-red-500'
      case 'completed':
        return 'bg-gray-500/20 text-gray-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getStateIcon = (state) => {
    switch (state) {
      case 'confirmed':
        return <CheckCircle size={16} />
      case 'cancelled':
        return <XCircle size={16} />
      case 'pending_approval':
      case 'approved':
        return <AlertCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'TBD'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Floating Add Booking Button */}
      <button
        onClick={() => setShowAddBooking(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:opacity-90 transition-opacity"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)' }}
      >
        <Plus size={22} />
        Add Booking
      </button>
      {showAddBooking && (
        <AddBookingModal onClose={() => setShowAddBooking(false)} onCreated={fetchBookings} />
      )}
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {['all', 'inquiry', 'pending_approval', 'confirmed', 'cancelled'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterOption
                ? 'bg-primary text-white'
                : 'bg-primary/10 text-light hover:bg-primary/20'
            }`}
          >
            {filterOption.replace('_', ' ').charAt(0).toUpperCase() + filterOption.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Grid */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 text-light/50">
          No bookings found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark/50 rounded-2xl p-6 border-2 border-primary/10 hover:border-primary/30 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-light mb-1">
                    {booking.venue_name || 'Unknown Venue'}
                  </h3>
                  <p className="text-sm text-light/60">{booking.contact_name}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStateColor(booking.state)}`}>
                  {getStateIcon(booking.state)}
                  {booking.state?.replace('_', ' ')}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-light/80">
                  <Calendar size={16} className="text-primary" />
                  <span className="text-sm">{formatDate(booking.event_date)}</span>
                  {booking.event_time && (
                    <span className="text-xs text-light/50">@ {booking.event_time}</span>
                  )}
                </div>

                {booking.payment_amount && (
                  <div className="flex items-center gap-2 text-light/80">
                    <DollarSign size={16} className="text-secondary" />
                    <span className="text-sm font-semibold">{formatCurrency(booking.payment_amount)}</span>
                  </div>
                )}

                {booking.estimated_attendance && (
                  <div className="flex items-center gap-2 text-light/80">
                    <Users size={16} className="text-primary" />
                    <span className="text-sm">{booking.estimated_attendance} expected</span>
                  </div>
                )}

                {booking.contact_email && (
                  <div className="flex items-center gap-2 text-light/80">
                    <MapPin size={16} className="text-primary" />
                    <a href={`mailto:${booking.contact_email}`} className="text-sm hover:text-primary transition-colors">
                      {booking.contact_email}
                    </a>
                  </div>
                )}
              </div>

              {/* Notes */}
              {booking.notes && (
                <p className="text-sm text-light/60 mb-4 line-clamp-2">
                  {booking.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-primary/10">
                <button
                  onClick={() => setEditingBooking(booking)}
                  className="px-3 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                {booking.state === 'pending_approval' && (
                  <button
                    onClick={() => updateBookingState(booking.id, 'approved')}
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                )}
                {booking.state === 'approved' && (
                  <button
                    onClick={() => updateBookingState(booking.id, 'contract_sent')}
                    className="flex-1 px-3 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Send Contract
                  </button>
                )}
                {booking.state === 'contract_sent' && (
                  <button
                    onClick={() => updateBookingState(booking.id, 'confirmed')}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Mark Confirmed
                  </button>
                )}
                {!['cancelled', 'completed'].includes(booking.state) && (
                  <button
                    onClick={() => updateBookingState(booking.id, 'cancelled')}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveBooking}
        />
      )}
    </div>
  )
}

export default AdminBookingsList
