import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Mail } from 'lucide-react';

const emptyMember = { name: '', email: '', role: '', phone: '', notes: '' };

const BandMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyMember);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('band_members').select('*').order('created_at', { ascending: true });
    if (error) setError(error.message);
    setMembers(data || []);
    setLoading(false);
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this band member?')) return;
    setError('');
    const { error } = await supabase.from('band_members').delete().eq('id', id);
    if (error) {
      setError(error.message);
      return;
    }
    fetchMembers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email) {
      setError('Name and email are required.');
      return;
    }
    let error;
    if (editingId) {
      ({ error } = await supabase.from('band_members').update(form).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('band_members').insert([{ ...form }]));
    }
    if (error) {
      setError(error.message);
      return;
    }
    setShowForm(false);
    setForm(emptyMember);
    setEditingId(null);
    fetchMembers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-light">Band Members</h2>
        <button className="btn-primary flex items-center gap-2" onClick={() => { setShowForm(true); setForm(emptyMember); setEditingId(null); }}>
          <Plus size={20} /> Add Band Member
        </button>
      </div>
      {loading ? (
        <div className="text-light/50">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="bg-dark/40 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-lg font-semibold text-light">{m.name}
                <span className="text-xs text-primary/70 ml-2">{m.role}</span>
              </div>
              <div className="flex items-center gap-2 text-light/70 text-sm">
                <Mail size={16} /> {m.email}
              </div>
              {m.phone && <div className="text-light/60 text-sm">{m.phone}</div>}
              {m.notes && <div className="text-light/50 text-xs italic">{m.notes}</div>}
              <div className="flex gap-2 mt-2">
                <button className="btn-secondary px-3 py-1" onClick={() => handleEdit(m)}><Edit size={16} /> Edit</button>
                <button className="btn-primary px-3 py-1 bg-red-700 hover:bg-red-800" onClick={() => handleDelete(m.id)}><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <form className="bg-dark/60 rounded-xl p-6 mt-4 space-y-4 max-w-md mx-auto" onSubmit={handleSubmit}>
          <h3 className="text-lg font-bold text-light mb-2">{editingId ? 'Edit' : 'Add'} Band Member</h3>
          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          <input className="w-full bg-dark/40 border border-primary/20 rounded-xl px-4 py-2 text-light" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="w-full bg-dark/40 border border-primary/20 rounded-xl px-4 py-2 text-light" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="w-full bg-dark/40 border border-primary/20 rounded-xl px-4 py-2 text-light" placeholder="Role (e.g. Guitarist)" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          <input className="w-full bg-dark/40 border border-primary/20 rounded-xl px-4 py-2 text-light" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <textarea className="w-full bg-dark/40 border border-primary/20 rounded-xl px-4 py-2 text-light" placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setForm(emptyMember); setEditingId(null); }}>Cancel</button>
            <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add'} Member</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BandMembers;
