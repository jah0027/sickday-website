import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const EditBookingModal = ({ booking, onClose, onSave }) => {
  const [form, setForm] = useState({ ...booking })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { data, error } = await supabase
      .from('bookings')
      .update({
        event_date: form.event_date,
        event_time: form.event_time,
        venue_name: form.venue_name,
        contact_name: form.contact_name,
        contact_email: form.contact_email,
        estimated_attendance: form.estimated_attendance ? parseInt(form.estimated_attendance) : null,
        payment_amount: form.payment_amount ? parseFloat(form.payment_amount) : null,
        notes: form.notes,
        state: form.state
      })
      .eq('id', booking.id)
      .select()
      .single()
    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      onSave(data)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-2xl font-bold text-light mb-6">Edit Booking</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light/80 mb-2">Event Date *</label>
              <input
                type="date"
                name="event_date"
                required
                value={form.event_date || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              />
            </div>
            <div>
              <label className="block text-light/80 mb-2">Event Time *</label>
              <input
                type="time"
                name="event_time"
                required
                value={form.event_time || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              />
            </div>
          </div>

          <div>
            <label className="block text-light/80 mb-2">Venue Name *</label>
            <input
              type="text"
              name="venue_name"
              required
              value={form.venue_name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light/80 mb-2">Contact Name *</label>
              <input
                type="text"
                name="contact_name"
                required
                value={form.contact_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              />
            </div>
            <div>
              <label className="block text-light/80 mb-2">Contact Email *</label>
              <input
                type="email"
                name="contact_email"
                required
                value={form.contact_email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-light/80 mb-2">Expected Attendance</label>
              <input
                type="number"
                name="estimated_attendance"
                value={form.estimated_attendance || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              />
            </div>
            <div>
              <label className="block text-light/80 mb-2">Amount ($) *</label>
              <input
                type="number"
                name="payment_amount"
                required
                step="0.01"
                value={form.payment_amount || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              />
            </div>
          </div>

          <div>
            <label className="block text-light/80 mb-2">Notes</label>
            <textarea
              name="notes"
              rows="3"
              value={form.notes || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
              placeholder="Additional details about the booking..."
            />
          </div>

          <div>
            <label className="block text-light/80 mb-2">State</label>
            <select
              name="state"
              value={form.state || 'inquiry'}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-light"
            >
              <option value="inquiry">Inquiry</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="negotiating">Negotiating</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="contract_sent">Contract Sent</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default EditBookingModal
