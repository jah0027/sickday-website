import React, { useState } from 'react'

import { motion } from 'framer-motion'
import { FileText, Download, Mail, Eye, X, Plus, Trash2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
const FerrisImg = '/Assets/Images/ferris.png';

const InvoiceGenerator = ({ invoice, contact, contacts = [], onClose, onSave }) => {
  const [selectedContactId, setSelectedContactId] = useState(contact?.id || null)
  const [lineItems, setLineItems] = useState(invoice?.items || [
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ])
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: invoice?.invoice_number || `INV-${Date.now()}`,
    issue_date: invoice?.issue_date || new Date().toISOString().split('T')[0],
    due_date: invoice?.due_date || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    notes: invoice?.notes || 'Thank you for your business!',
    tax: invoice?.tax || 0,
    status: invoice?.status || 'draft'
  })

  const selectedContact = contacts.find(c => c.id === selectedContactId) || contact

  const calculateAmount = (quantity, rate) => {
    return (parseFloat(quantity) * parseFloat(rate)).toFixed(2)
  }

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems]
    updated[index][field] = value
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = calculateAmount(
        updated[index].quantity,
        updated[index].rate
      )
    }
    setLineItems(updated)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0)
  const taxAmount = (subtotal * parseFloat(invoiceData.tax || 0)) / 100
  const total = subtotal + taxAmount

  const handleSave = async () => {
    await onSave({
      ...invoiceData,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
      items: lineItems.filter(item => item.description)
    }, selectedContactId)
  }

  const downloadPDF = async () => {
    const element = document.getElementById('invoice-preview')
    // Save original styles
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflow = element.style.overflow;
    // Remove scroll restriction
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    // Wait for style changes to apply
    await new Promise(r => setTimeout(r, 50));

    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')

    // Restore original styles
    element.style.maxHeight = originalMaxHeight;
    element.style.overflow = originalOverflow;

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const pageHeight = 297
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Ask user how many pages to print
    let maxPages = 1;
    const userInput = window.prompt('How many pages do you want to print?', '1');
    if (userInput) {
      const parsed = parseInt(userInput);
      if (!isNaN(parsed) && parsed > 0) {
        maxPages = parsed;
      }
    }

    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    position = -pageHeight;
    pageCount++;

    // Add more pages if needed and within user limit
    while (heightLeft > 0 && pageCount < maxPages) {
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
      pageCount++;
    }
    pdf.save(`${invoiceData.invoice_number}.pdf`);
  }

  const sendEmail = () => {
    const subject = `Invoice ${invoiceData.invoice_number}`
    const body = `Dear ${contact.first_name} ${contact.last_name},

Please find attached your invoice ${invoiceData.invoice_number} for $${total.toFixed(2)}.

Due Date: ${new Date(invoiceData.due_date).toLocaleDateString()}

${invoiceData.notes}

Thank you!
Sick Day with Ferris`
    
    window.open(`mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  return (
    <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-dark border border-primary/20 rounded-2xl p-8 max-w-5xl w-full my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">{invoice?.id ? 'Edit Invoice' : 'Create Invoice'}</h2>
          <button onClick={onClose} className="text-light/70 hover:text-light">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Editor */}
          <div className="space-y-6">
            <div>
              <label className="block text-light/70 text-sm mb-2">Bill To (Contact)</label>
              <select
                value={selectedContactId || ''}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
              >
                <option value="">Select a contact...</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-light/70 text-sm mb-2">Invoice #</label>
                <input
                  type="text"
                  value={invoiceData.invoice_number}
                  onChange={(e) => setInvoiceData({...invoiceData, invoice_number: e.target.value})}
                  className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-light/70 text-sm mb-2">Issue Date</label>
                <input
                  type="date"
                  value={invoiceData.issue_date}
                  onChange={(e) => setInvoiceData({...invoiceData, issue_date: e.target.value})}
                  className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-light/70 text-sm mb-2">Due Date</label>
              <input
                type="date"
                value={invoiceData.due_date}
                onChange={(e) => setInvoiceData({...invoiceData, due_date: e.target.value})}
                className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-light/70 text-sm mb-2">Status</label>
              <select
                value={invoiceData.status}
                onChange={(e) => setInvoiceData({...invoiceData, status: e.target.value})}
                className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            {/* Line Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-light/70 text-sm">Line Items</label>
                <button onClick={addLineItem} className="text-secondary hover:text-secondary/80 text-sm flex items-center gap-1">
                  <Plus size={16} />
                  Add Item
                </button>
              </div>
              
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                    className="col-span-5 bg-dark/50 border border-primary/20 rounded-lg px-3 py-2 text-light text-sm focus:outline-none focus:border-primary/50"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                    className="col-span-2 bg-dark/50 border border-primary/20 rounded-lg px-3 py-2 text-light text-sm focus:outline-none focus:border-primary/50"
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                    className="col-span-3 bg-dark/50 border border-primary/20 rounded-lg px-3 py-2 text-light text-sm focus:outline-none focus:border-primary/50"
                  />
                  <div className="col-span-1 flex items-center text-light/70 text-sm">
                    ${item.amount}
                  </div>
                  <button
                    onClick={() => removeLineItem(index)}
                    className="col-span-1 text-primary/70 hover:text-primary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-light/70 text-sm mb-2">Tax (%)</label>
              <input
                type="number"
                value={invoiceData.tax}
                onChange={(e) => setInvoiceData({...invoiceData, tax: e.target.value})}
                className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-light/70 text-sm mb-2">Notes</label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                rows="3"
                className="w-full bg-dark/50 border border-primary/20 rounded-xl px-4 py-2 text-light focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <FileText size={20} />
                Save Invoice
              </button>
              <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2">
                <Download size={20} />
                PDF
              </button>
              <button onClick={sendEmail} className="btn-secondary flex items-center gap-2">
                <Mail size={20} />
                Email
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="bg-white rounded-xl p-8 text-dark overflow-auto max-h-[600px] shadow-lg relative" id="invoice-preview">
            <div className="flex items-center mb-8">
              <img src={FerrisImg} alt="SickDay Guy" style={{ height: '120px', marginRight: '2rem', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }} />
              <div>
                <h1 className="text-4xl font-display font-bold text-blue-600 mb-2">INVOICE</h1>
                <p className="text-gray-600">Sick Day with Ferris</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-sm text-gray-600 mb-2">BILL TO:</h3>
                <p className="font-semibold">{contact.first_name} {contact.last_name}</p>
                {contact.email && <p className="text-sm text-gray-600">{contact.email}</p>}
                {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                {contact.address_city && (
                  <p className="text-sm text-gray-600">{contact.address_city}, {contact.address_state}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Invoice #: <span className="font-semibold text-dark">{invoiceData.invoice_number}</span></p>
                <p className="text-sm text-gray-600">Issue Date: {new Date(invoiceData.issue_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Due Date: {new Date(invoiceData.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2 text-sm text-gray-600">DESCRIPTION</th>
                  <th className="text-center py-2 text-sm text-gray-600">QTY</th>
                  <th className="text-right py-2 text-sm text-gray-600">RATE</th>
                  <th className="text-right py-2 text-sm text-gray-600">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.filter(item => item.description).map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm">{item.description}</td>
                    <td className="py-3 text-sm text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-right">${parseFloat(item.rate).toFixed(2)}</td>
                    <td className="py-3 text-sm text-right">${parseFloat(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Tax ({invoiceData.tax}%):</span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-xl text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {invoiceData.notes && (
              <div className="mt-4 flex justify-end">
                <p className="text-base font-semibold text-blue-600">{invoiceData.notes}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InvoiceGenerator
