// src/pages/NewWorkflow.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workflowApi } from '../services/api';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, X, User2, ChevronDown } from 'lucide-react';

const CATEGORIES = ['Finance','HR','IT','Legal','Compliance','Marketing','Procurement','Operations','General'];
const PRIORITIES = ['LOW','NORMAL','HIGH','URGENT'];

export default function NewWorkflow() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    title: '', description: '', category: 'General',
    priority: 'NORMAL', dueDate: '', tags: [], approverIds: [],
  });
  const [tagInput, setTagInput] = useState('');

  // Fetch users for approver selection
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(r => r.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => workflowApi.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries(['workflows']);
      qc.invalidateQueries(['dashboard']);
      toast.success('Workflow submitted!');
      navigate(`/workflows/${res.data.id}`);
    },
    onError: () => toast.error('Failed to submit workflow'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (form.approverIds.length === 0) return toast.error('Add at least one approver');
    mutation.mutate({
      ...form,
      tags: form.tags,
      dueDate: form.dueDate || null,
    });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag    = (t)  => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));
  const addApprover  = (id) => {
    const numId = Number(id);
    if (!form.approverIds.includes(numId)) setForm(f => ({ ...f, approverIds: [...f.approverIds, numId] }));
  };
  const removeApprover = (id) => setForm(f => ({ ...f, approverIds: f.approverIds.filter(x => x !== id) }));

  const getUser = (id) => users.find(u => u.id === id);

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-ink-400 hover:text-ink-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-ink-50 tracking-tight">New Approval Request</h1>
        <p className="text-ink-400 text-sm mt-1">Submit a workflow for multi-level review and approval.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-ink-200 text-sm uppercase tracking-wider mb-2">
            Request Details
          </h2>

          <div>
            <label className="block text-xs font-medium text-ink-300 mb-1.5">Title *</label>
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Q4 Budget Approval" className="input" required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-300 mb-1.5">Description</label>
            <textarea
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Provide context about this approval request..."
              rows={3} className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1.5">Category</label>
              <div className="relative">
                <select value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="input appearance-none pr-8">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1.5">Priority</label>
              <div className="relative">
                <select value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className="input appearance-none pr-8">
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-300 mb-1.5">Due Date (optional)</label>
            <input type="date" value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              className="input" />
          </div>
        </div>

        {/* Tags */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-ink-200 text-sm uppercase tracking-wider mb-4">Tags</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag and press Enter" className="input flex-1"
            />
            <button type="button" onClick={addTag} className="btn-ghost flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-full">
                  {t}
                  <button type="button" onClick={() => removeTag(t)}>
                    <X className="w-3 h-3 hover:text-amber-200" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Approvers (multi-level) */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-ink-200 text-sm uppercase tracking-wider mb-1">
            Approval Chain *
          </h2>
          <p className="text-xs text-ink-500 mb-4">Approvers are added in order — Stage 1, Stage 2, etc.</p>

          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <select onChange={e => { addApprover(e.target.value); e.target.value = ''; }}
                className="input pl-10 appearance-none" defaultValue="">
                <option value="" disabled>Select an approver to add...</option>
                {users.filter(u => !form.approverIds.includes(u.id)).map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
                ))}
              </select>
            </div>
          </div>

          {form.approverIds.length > 0 ? (
            <div className="space-y-2">
              {form.approverIds.map((id, idx) => {
                const u = getUser(id);
                return (
                  <div key={id} className="flex items-center gap-3 p-3 bg-ink-700/50 border border-ink-600/50 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold font-display flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-200">{u?.name || `User ${id}`}</p>
                      <p className="text-xs text-ink-500">{u?.role} — Stage {idx + 1}</p>
                    </div>
                    <button type="button" onClick={() => removeApprover(id)}
                      className="text-ink-500 hover:text-rose-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 bg-ink-800/50 rounded-xl border border-dashed border-ink-700">
              <p className="text-sm text-ink-500">No approvers added yet.</p>
              <p className="text-xs text-ink-600 mt-1">Select approvers above to build the approval chain.</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={mutation.isPending} className="btn-primary flex items-center gap-2">
            {mutation.isPending ? (
              <><div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" /> Submitting...</>
            ) : 'Submit for Approval'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}
