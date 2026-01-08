import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Calendar, Mail, Phone, MapPin, Plus, Trash2, Edit, Search, LogOut, FileText, Upload, Download, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import BandMemberPortal from './BandMemberPortal'
import BandMembers from './BandMembers'
import AdminBookings from './AdminBookings'
import AdminBookingsList from './AdminBookingsList'
import Papa from 'papaparse'

const Admin = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')
  const [contacts, setContacts] = useState([])
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [editingContact, setEditingContact] = useState(null)
  const [selectedContacts, setSelectedContacts] = useState([])
  const [selectedPayments, setSelectedPayments] = useState([])
  const contactsFileInputRef = useRef(null)
  const paymentsFileInputRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [contactsData, paymentsData, invoicesData] = await Promise.all([
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*, contacts(first_name, last_name, email)').order('payment_date', { ascending: false }),
      supabase.from('invoices').select('*, contacts(first_name, last_name, email)').order('issue_date', { ascending: false })
    ])
    
    console.log('Invoices data:', invoicesData)
    
    if (contactsData.data) setContacts(contactsData.data)
    if (paymentsData.data) setPayments(paymentsData.data)
    if (invoicesData.data) setInvoices(invoicesData.data)
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const deleteContact = async (id) => {
    if (confirm('Delete this contact?')) {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) {
        if (error.code === '23503') {
          alert('Cannot delete this contact because they have invoices or payments associated with them. Please delete those first.')
        } else {
          alert('Error deleting contact: ' + error.message)
        }
      } else {
        fetchData()
              {tab === 'availability' && <Users size={18} />}
      }
    }
  }

  const deleteSelectedContacts = async () => {
    if (selectedContacts.length === 0) return
    if (confirm(`Delete ${selectedContacts.length} selected contacts?`)) {
      let successCount = 0
      let failCount = 0
      for (const id of selectedContacts) {
        const { error } = await supabase.from('contacts').delete().eq('id', id)
        if (error) {
          failCount++
        } else {
          successCount++
        }
      }
      setSelectedContacts([])
      fetchData()
      if (failCount > 0) {
        alert(`Deleted ${successCount} contacts. ${failCount} could not be deleted (likely have invoices or payments).`)
      }
    }
  }

  const deleteSelectedPayments = async () => {
    if (selectedPayments.length === 0) return
    if (confirm(`Delete ${selectedPayments.length} selected payments?`)) {
      for (const id of selectedPayments) {
        await supabase.from('payments').delete().eq('id', id)
      }
      setSelectedPayments([])
      fetchData()
    }
  }

  const updateContact = async (id, contactData) => {
    const { error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
    
    if (!error) {
      fetchData()
      setEditingContact(null)
    }
  }

  const deletePayment = async (id) => {
    if (confirm('Delete this payment?')) {
      await supabase.from('payments').delete().eq('id', id)
      fetchData()
    }
  }

  const deleteInvoice = async (id) => {
    if (confirm('Delete this invoice?')) {
      await supabase.from('invoices').delete().eq('id', id)
      fetchData()
    }
  }

  const markInvoiceAsPaid = async (invoice) => {
    if (confirm(`Mark invoice ${invoice.invoice_number} as paid?`)) {
      // Update invoice status
      await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoice.id)
      
      // Create payment record
      await supabase.from('payments').insert([{
        contact_id: invoice.contact_id,
        payment_date: new Date().toISOString().split('T')[0],
        amount: parseFloat(invoice.total),
        status: 'completed',
        payment_method: 'other',
        notes: `Payment for invoice ${invoice.invoice_number}`,
        invoice_id: invoice.id
      }])
      
      fetchData()
    }
  }

  const editInvoice = async (invoice) => {
    // Fetch invoice items
    const { data: items } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id)
    
    const contact = contacts.find(c => c.id === invoice.contact_id)
    
    setSelectedInvoice({ ...invoice, items })
    setSelectedContact(contact)
    setShowInvoiceGenerator(true)
  }

  const saveInvoice = async (invoiceData, contactId, invoiceId = null) => {
    const { items, ...invoice } = invoiceData
    
    if (invoiceId) {
      // Update existing invoice
      await supabase
        .from('invoices')
        .update({
          ...invoice,
          contact_id: contactId
        })
        .eq('id', invoiceId)

      // Delete old items and insert new ones
      await supabase.from('invoice_items').delete().eq('invoice_id', invoiceId)
      
      const itemsToInsert = items.map(item => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount)
      }))

      await supabase.from('invoice_items').insert(itemsToInsert)
    } else {
      // Create new invoice
      const { data: newInvoice, error } = await supabase
        .from('invoices')
        .insert([{
          ...invoice,
          contact_id: contactId,
          status: invoice.status || 'draft'
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating invoice:', error)
        return
      }

      // Insert invoice items
      const itemsToInsert = items.map(item => ({
        invoice_id: newInvoice.id,
        description: item.description,
        quantity: parseFloat(item.quantity),
        rate: parseFloat(item.rate),
        amount: parseFloat(item.amount)
      }))

      await supabase.from('invoice_items').insert(itemsToInsert)
    }
  }

  const exportContactsCSV = () => {
    const csv = Papa.unparse(contacts)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportPaymentsCSV = () => {
    const paymentsData = payments.map(p => ({
      contact_name: `${p.contacts?.first_name} ${p.contacts?.last_name}`,
      contact_email: p.contacts?.email,
      payment_date: p.payment_date,
      amount: p.amount,
      status: p.status,
      payment_method: p.payment_method,
      notes: p.notes
    }))
    const csv = Papa.unparse(paymentsData)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const importContactsCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const contactsToImport = results.data.filter(row => row.first_name || row.email)
        let addedCount = 0
        let skippedCount = 0
        
        for (const contact of contactsToImport) {
          // Check if contact with same email already exists
          if (contact.email) {
            const { data: existing } = await supabase
              .from('contacts')
              .select('id')
              .eq('email', contact.email)
              .limit(1)
            
            if (existing && existing.length > 0) {
              skippedCount++
              continue // Skip this contact, it already exists
            }
          }
          
          // Insert new contact
          const { error } = await supabase.from('contacts').insert([{
            first_name: contact.first_name || '',
            last_name: contact.last_name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            address_street: contact.address_street || '',
            address_city: contact.address_city || '',
            address_state: contact.address_state || '',
            address_zip: contact.address_zip || '',
            labels: contact.labels ? contact.labels.split(',') : []
          }])
          
          if (!error) {
            addedCount++
          }
        }
        
        fetchData()
        alert(`Imported ${addedCount} new contacts${skippedCount > 0 ? `, skipped ${skippedCount} duplicates` : ''}`)
      }
    })
  }

  const importPaymentsCSV = (e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const paymentsToImport = results.data.filter(row => row.amount)
        let successCount = 0
        let failCount = 0
        
        for (const payment of paymentsToImport) {
          try {
            // Find contact by email
            let contact = null
            if (payment.contact_email) {
              const { data, error } = await supabase
                .from('contacts')
                .select('id')
                .eq('email', payment.contact_email)
                .limit(1)
              
              if (data && data.length > 0) {
                contact = data[0]
              }
            }

            if (contact) {
              const { error } = await supabase.from('payments').insert([{
                contact_id: contact.id,
                payment_date: payment.payment_date || new Date().toISOString().split('T')[0],
                amount: parseFloat(payment.amount),
                status: payment.status || 'completed',
                payment_method: payment.payment_method || 'cash',
                notes: payment.notes || ''
              }])
              
              if (!error) {
                successCount++
              } else {
                failCount++
                console.error('Error inserting payment:', error)
              }
            } else {
              failCount++
              console.warn('No contact found for email:', payment.contact_email)
            }
          } catch (error) {
            failCount++
            console.error('Error processing payment:', error)
          }
        }
        
        fetchData()
        alert(`Imported ${successCount} payments successfully${failCount > 0 ? `, ${failCount} failed` : ''}`)
      }
    })
  }

  const filteredContacts = contacts.filter(c => 
    (c.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const stats = [
    { icon: Users, label: 'Total Contacts', value: contacts.length, color: 'from-primary/20 to-primary/5' },
    { icon: DollarSign, label: 'Total Payments', value: payments.length, color: 'from-secondary/20 to-secondary/5' },
    { icon: Calendar, label: 'This Month', value: payments.filter(p => new Date(p.payment_date) > new Date(Date.now() - 30*24*60*60*1000)).length, color: 'from-primary/20 to-secondary/20' },
  ]

  return (
    <div className="min-h-screen bg-dark py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
              Band Management
            </h1>
            <p className="text-light/70">Manage contacts and track payments</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-light/70 hover:text-light transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl border border-primary/20`}
            >
              <stat.icon className="text-primary mb-4" size={32} />
              <div className="text-3xl font-bold text-light mb-2">{stat.value}</div>
              <div className="text-light/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-primary/20 overflow-x-auto">
          {['bookings', 'confirmed', 'contacts', 'receipts', 'invoices', 'availability', 'band-members', 'constraints'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-light/50 hover:text-light/80'
              }`}
            >
              {tab === 'bookings' && <MessageSquare size={18} />}
              {tab === 'confirmed' && <Calendar size={18} />}
              {tab === 'availability' && <Users size={18} />}
              {tab === 'band-members' && <Users size={18} />}
              {tab === 'constraints' && <Edit size={18} />}
              {tab === 'bookings' ? 'Book/Inquiries' : tab === 'confirmed' ? 'Confirmed Bookings' : tab === 'receipts' ? 'Receipts' : tab === 'availability' ? 'Availability' : tab === 'band-members' ? 'Band Members' : tab === 'constraints' ? 'Booking Constraints' : tab}
            </button>
          ))}
        </div>

        {/* Booking Constraints Tab Content */}
        {activeTab === 'constraints' && (
          <div className="bg-dark/60 rounded-2xl p-8 my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary">Booking Constraints</h2>
            <p className="text-light/80 mb-4">Here you can view and update the booking constraints for your band. (Form coming soon!)</p>
            {/* TODO: Add form to update constraints */}
          </div>
        )}
        {/* Search & Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light/50" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark/50 border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-light placeholder-light/50 focus:outline-none focus:border-primary/50"
            />
          </div>
          
          {/* CSV Import/Export buttons for contacts and payments */}
          {activeTab === 'contacts' && (
            <>
              {selectedContacts.length > 0 && (
                <button
                  onClick={deleteSelectedContacts}
                  className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-2 whitespace-nowrap"
                >
                  <Trash2 size={20} />
                  Delete {selectedContacts.length}
                </button>
              )}
              <input
                type="file"
                ref={contactsFileInputRef}
                onChange={importContactsCSV}
                accept=".csv"
                className="hidden"
              />
              <button
                onClick={() => contactsFileInputRef.current?.click()}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <Upload size={20} />
                Import CSV
              </button>
              <button
                onClick={exportContactsCSV}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <Download size={20} />
                Export CSV
              </button>
            </>
          )}
          
          {activeTab === 'receipts' && (
            <>
              {selectedPayments.length > 0 && (
                <button
                  onClick={deleteSelectedPayments}
                  className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-2 whitespace-nowrap"
                >
                  <Trash2 size={20} />
                  Delete {selectedPayments.length}
                </button>
              )}
              <input
                type="file"
                ref={paymentsFileInputRef}
                onChange={importPaymentsCSV}
                accept=".csv"
                className="hidden"
              />
              <button
                onClick={() => paymentsFileInputRef.current?.click()}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <Upload size={20} />
                Import CSV
              </button>
              <button
                onClick={exportPaymentsCSV}
                className="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <Download size={20} />
                Export CSV
              </button>
            </>
          )}
          
          <button
            onClick={() => {
              if (
                activeTab === 'bookings' ||
                activeTab === 'confirmed' ||
                activeTab === 'availability' ||
                activeTab === 'band-members'
              ) {
                // Bookings, confirmed, availability, and band-members tabs don't need an Add button (yet)
                return
              } else if (activeTab === 'contacts') {
                setShowAddContact(true)
              } else if (activeTab === 'payments') {
                setShowAddPayment(true)
              } else if (activeTab === 'invoices') {
                setShowInvoiceGenerator(true)
              }
            }}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
            disabled={
              activeTab === 'bookings' ||
              activeTab === 'confirmed' ||
              activeTab === 'availability' ||
              activeTab === 'band-members'
            }
            style={{
              display:
                activeTab === 'bookings' ||
                activeTab === 'confirmed' ||
                activeTab === 'availability' ||
                activeTab === 'band-members'
                  ? 'none'
                  : 'flex',
            }}
          >
            <Plus size={20} />
            Add {activeTab === 'contacts' ? 'Contact' : activeTab === 'receipts' ? 'Receipt' : 'Invoice'}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-light/50">Loading...</div>
        ) : activeTab === 'bookings' ? (
          <AdminBookings />
        ) : activeTab === 'confirmed' ? (
          <AdminBookingsList />
        ) : activeTab === 'contacts' ? (
          <ContactsList 
            contacts={filteredContacts} 
            invoices={invoices}
            payments={payments}
            onDelete={deleteContact} 
            onEdit={(contact) => setEditingContact(contact)} 
            onCreateInvoice={(contact) => { setSelectedContact(contact); setShowInvoiceGenerator(true); }}
            selectedContacts={selectedContacts}
            onToggleSelect={(id) => {
              setSelectedContacts(prev => 
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
              )
            }}
            onSelectAll={(ids) => setSelectedContacts(ids)}
          />
        ) : activeTab === 'receipts' ? (
          <PaymentsList 
            payments={payments} 
            onDelete={deletePayment}
            selectedPayments={selectedPayments}
            onToggleSelect={(id) => {
              setSelectedPayments(prev => 
                prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
              )
            }}
            onSelectAll={(ids) => setSelectedPayments(ids)}
          />
        ) : activeTab === 'invoices' ? (
          <InvoicesList invoices={invoices} contacts={contacts} onDelete={deleteInvoice} onEdit={editInvoice} onMarkAsPaid={markInvoiceAsPaid} />
        ) : activeTab === 'availability' ? (
          <BandMemberPortal />
        ) : activeTab === 'band-members' ? (
          <BandMembers />
        ) : null}

        {/* Modals */}
        {showAddContact && (
          <AddContactModal onClose={() => { setShowAddContact(false); fetchData(); }} />
        )}
        {editingContact && (
          <EditContactModal 
            contact={editingContact}
            onClose={() => setEditingContact(null)}
            onSave={(contactData) => updateContact(editingContact.id, contactData)}
          />
        )}
        {showAddPayment && (
          <AddPaymentModal contacts={contacts} onClose={() => { setShowAddPayment(false); fetchData(); }} />
        )}
        {showInvoiceGenerator && selectedContact && (
          <InvoiceGenerator
            contact={selectedContact}
            contacts={contacts}
            invoice={selectedInvoice}
            onClose={() => { 
              setShowInvoiceGenerator(false)
              setSelectedContact(null)
              setSelectedInvoice(null)
            }}
            onSave={async (invoiceData, contactId) => {
              await saveInvoice(invoiceData, contactId || selectedContact.id, selectedInvoice?.id)
              setShowInvoiceGenerator(false)
              setSelectedContact(null)
              setSelectedInvoice(null)
              fetchData()
            }}
          />
        )}
        {showInvoiceGenerator && !selectedContact && (
          <ContactSelectorModal 
            contacts={contacts}
            onSelect={(contact) => {
              setSelectedContact(contact)
              // Don't close showInvoiceGenerator, it will show the invoice form next
            }}
            onClose={() => {
              setShowInvoiceGenerator(false)
              setSelectedContact(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

const ContactsList = ({ contacts, invoices, payments, onDelete, onEdit, onCreateInvoice, selectedContacts, onToggleSelect, onSelectAll }) => {
  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length
  
  const getContactInvoiceCount = (contactId) => {
    return invoices?.filter(inv => inv.contact_id === contactId).length || 0
  }
  
  const getContactPaymentCount = (contactId) => {
    return payments?.filter(pay => pay.contact_id === contactId).length || 0
  }
  
  return (
    <div className="space-y-4">
      {contacts.length > 0 && (
        <div className="flex items-center gap-2 text-light/70 text-sm">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => onSelectAll(allSelected ? [] : contacts.map(c => c.id))}
            className="w-4 h-4 rounded border-primary/20 bg-dark/50"
          />
          <span>Select All</span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {contacts.map(contact => (
          <motion.div key={contact.id} className="bg-dark/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="font-semibold text-light text-lg">{contact.first_name} {contact.last_name}</div>
              <div className="text-light/70 text-sm">{contact.email}</div>
              {contact.address_city && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-secondary" />
                  <span>{contact.address_city}, {contact.address_state}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(contact)}
                className="text-light/70 hover:text-light transition-colors"
                title="Edit Contact"
              >
                <Edit size={20} />
              </button>
              <button
                onClick={() => onCreateInvoice(contact)}
                className="text-secondary/70 hover:text-secondary transition-colors"
                title="Create Invoice"
              >
                <FileText size={20} />
              </button>
              <button
                onClick={() => onDelete(contact.id)}
                className="text-primary/70 hover:text-primary transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const PaymentsList = ({ payments, onDelete, selectedPayments, onToggleSelect, onSelectAll }) => {
  const allSelected = payments.length > 0 && selectedPayments.length === payments.length
  
  return (
    <div className="space-y-4">
      {payments.length > 0 && (
        <div className="flex items-center gap-2 text-light/70 text-sm">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => onSelectAll(allSelected ? [] : payments.map(p => p.id))}
            className="w-4 h-4 rounded border-primary/20 bg-dark/50"
          />
          <span>Select All</span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {payments.map(payment => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedPayments.includes(payment.id)}
                onChange={() => onToggleSelect(payment.id)}
                className="mt-1 w-5 h-5 rounded border-primary/20 bg-dark/50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-light">
                    ${parseFloat(payment.amount).toFixed(2)}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    payment.status === 'Successful' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <div className="space-y-1 text-light/70">
                  <div>{payment.contacts?.first_name} {payment.contacts?.last_name} - {payment.contacts?.email}</div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-secondary" />
                    <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                  </div>
                  {payment.notes && <div className="text-sm">{payment.notes}</div>}
                </div>
              </div>
              <button
                onClick={() => onDelete(payment.id)}
                className="text-primary/70 hover:text-primary transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const AddContactModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address_city: '', address_state: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await supabase.from('contacts').insert([formData])
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark border border-primary/20 rounded-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6">Add Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Contact</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const AddPaymentModal = ({ contacts, onClose }) => {
  const [formData, setFormData] = useState({
    contact_id: '', amount: '', payment_date: new Date().toISOString().split('T')[0],
    status: 'Successful', payment_method: 'Pay in Person'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await supabase.from('payments').insert([{
      ...formData,
      payment_date: new Date(formData.payment_date).toISOString()
    }])
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark border border-primary/20 rounded-2xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6">Add Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.contact_id}
            onChange={(e) => setFormData({...formData, contact_id: e.target.value})}
            required
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          >
            <option value="">Select Contact</option>
            {contacts.map(c => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name} - {c.email}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <input
            type="date"
            value={formData.payment_date}
            onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
            required
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Payment</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const InvoicesList = ({ invoices, contacts, onDelete, onEdit, onMarkAsPaid }) => {
  console.log('InvoicesList rendering with:', invoices)
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-green-400'
      case 'sent': return 'text-blue-400'
      case 'overdue': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center py-12 text-light/50">
        No invoices yet. Click "Add Invoice" to create one.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {invoices.map(invoice => {
        console.log('Rendering invoice:', invoice)
        return (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-light">
                    {invoice.invoice_number || 'N/A'}
                  </h3>
                  <span className={`text-sm font-semibold ${getStatusColor(invoice.status)}`}>
                    {invoice.status?.toUpperCase() || 'DRAFT'}
                  </span>
                </div>
                <div className="space-y-1 text-light/70">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-secondary" />
                    <span>{invoice.contacts?.first_name || ''} {invoice.contacts?.last_name || 'Unknown Contact'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-secondary" />
                    <span>Issue: {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : 'N/A'}</span>
                    <span className="mx-2">•</span>
                    <span>Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-secondary" />
                    <span className="font-semibold text-light">${invoice.total ? parseFloat(invoice.total).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {invoice.status !== 'paid' && (
                  <button
                    onClick={() => onMarkAsPaid(invoice)}
                    className="text-green-400/70 hover:text-green-400 transition-colors"
                    title="Mark as Paid"
                  >
                    <DollarSign size={20} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(invoice)}
                  className="text-secondary/70 hover:text-secondary transition-colors"
                  title="Edit Invoice"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => onDelete(invoice.id)}
                  className="text-primary/70 hover:text-primary transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

const ContactSelectorModal = ({ contacts, onSelect, onClose }) => {
  const [search, setSearch] = useState('')
  
  const filteredContacts = contacts.filter(c =>
    (c.first_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.last_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark border border-primary/20 rounded-2xl p-8 max-w-2xl w-full"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6">Select Contact</h2>
        
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light/50" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-light placeholder-light/50 focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-light/50">
              {contacts.length === 0 ? 'No contacts found. Add some contacts first.' : 'No matching contacts.'}
            </div>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => onSelect(contact)}
                className="w-full bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20 hover:border-primary/40 transition-all text-left"
              >
                <div className="font-semibold text-light">
                  {contact.first_name} {contact.last_name}
                </div>
                <div className="text-sm text-light/70">{contact.email}</div>
              </button>
            ))
          )}
        </div>

        <button onClick={onClose} className="btn-secondary w-full">
          Cancel
        </button>
      </motion.div>
    </div>
  )
}

const EditContactModal = ({ contact, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    email: contact.email || '',
    phone: contact.phone || '',
    address_street: contact.address_street || '',
    address_city: contact.address_city || '',
    address_state: contact.address_state || '',
    address_zip: contact.address_zip || '',
    labels: contact.labels?.join(', ') || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      labels: formData.labels ? formData.labels.split(',').map(l => l.trim()) : []
    })
  }

  return (
    <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark border border-primary/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold gradient-text mb-6">Edit Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              required
              className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <input
            type="text"
            placeholder="Street Address"
            value={formData.address_street}
            onChange={(e) => setFormData({...formData, address_street: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City"
              value={formData.address_city}
              onChange={(e) => setFormData({...formData, address_city: e.target.value})}
              className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
            />
            <input
              type="text"
              placeholder="State"
              value={formData.address_state}
              onChange={(e) => setFormData({...formData, address_state: e.target.value})}
              className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
            />
            <input
              type="text"
              placeholder="ZIP"
              value={formData.address_zip}
              onChange={(e) => setFormData({...formData, address_zip: e.target.value})}
              className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
            />
          </div>
          <input
            type="text"
            placeholder="Labels (comma separated)"
            value={formData.labels}
            onChange={(e) => setFormData({...formData, labels: e.target.value})}
            className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-3 text-light focus:outline-none focus:border-primary/50"
          />
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Admin
