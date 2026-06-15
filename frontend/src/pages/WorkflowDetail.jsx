// src/pages/WorkflowDetail.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowApi, approvalApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, PriorityBadge, StageProgress, Spinner } from '../components/ui';
import toast from 'react-hot-toast';
import {
  CheckCircle2, XCircle, ArrowLeft, Clock, User2,
  Tag, Calendar, MessageSquare, Activity, GitBranch
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function WorkflowDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [decision, setDecision]   = useState('');
  const [comments, setComments]   = useState('');
  const [showForm, setShowForm]   = useState(false);

  const { data: wf, isLoading } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => workflowApi.getById(id).then(r => r.data),
  });

  const decideMutation = useMutation({
    mutationFn: (data) => approvalApi.decide(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['workflow', id]);
      qc.invalidateQueries(['dashboard']);
      toast.success('Decision recorded!');
      setShowForm(false); setDecision(''); setComments('');
    },
    onError: () => toast.error('Could not record decision'),
  });

  const handleDecide = () => {
    if (!decision) return toast.error('Select a decision first');
    decideMutation.mutate({ decision, comments });
  };

  if (isLoading) return <div className="p-8"><Spinner /></div>;
  if (!wf) return <div className="p-8 text-ink-500">Workflow not found.</div>;

  const myApproval = wf.approvals?.find(
    a => a.approverName === user?.name && a.decision === 'PENDING' && a.stage === wf.currentStage
  );

  return (
    <div className="p-8 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-ink-400 hover:text-ink-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="card p-6 mb-6 animate-slide-up">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl text-ink-50 mb-2">{wf.title}</h1>
            {wf.description && <p className="text-ink-400 text-sm leading-relaxed">{wf.description}</p>}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <StatusBadge status={wf.status} />
            <PriorityBadge priority={wf.priority} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-ink-700">
          <div className="flex items-center gap-2 text-sm">
            <User2 className="w-4 h-4 text-ink-500" />
            <div><p className="text-xs text-ink-500">Submitter</p><p className="text-ink-200">{wf.submitterName}</p></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-ink-500" />
            <div><p className="text-xs text-ink-500">Category</p><p className="text-ink-200">{wf.category}</p></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-ink-500" />
            <div>
              <p className="text-xs text-ink-500">Submitted</p>
              <p className="text-ink-200">{wf.createdAt ? formatDistanceToNow(new Date(wf.createdAt), { addSuffix: true }) : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-ink-500" />
            <div><p className="text-xs text-ink-500">Due Date</p><p className="text-ink-200">{wf.dueDate || 'No deadline'}</p></div>
          </div>
        </div>

        {/* Stage Progress */}
        <div className="mt-4 pt-4 border-t border-ink-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-ink-400">Approval Progress</span>
            <span className="text-xs text-ink-500">Stage {wf.currentStage} of {wf.totalStages}</span>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: wf.totalStages }, (_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-700
                ${i < wf.currentStage - 1 ? 'bg-jade-500' :
                  i === wf.currentStage - 1 ? 'bg-amber-400 animate-pulse-slow' :
                  'bg-ink-600'}`}
              />
            ))}
          </div>
        </div>

        {/* Tags */}
        {wf.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {wf.tags.map(t => (
              <span key={t} className="text-xs px-2 py-1 bg-ink-700 text-ink-300 rounded-lg">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Approval Stages */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-ink-700">
              <GitBranch className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-semibold text-ink-100 text-sm">Approval Stages</h2>
            </div>
            <div className="divide-y divide-ink-700/40">
              {wf.approvals?.map(a => (
                <div key={a.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                        ${a.decision === 'APPROVED' ? 'bg-jade-500/20 text-jade-400' :
                          a.decision === 'REJECTED' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-amber-500/20 text-amber-400'}`}>
                        {a.stage}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-200">{a.stageName}</p>
                        <p className="text-xs text-ink-500">{a.approverName}</p>
                        {a.comments && (
                          <div className="mt-2 flex items-start gap-1.5 bg-ink-700/50 rounded-lg p-2.5">
                            <MessageSquare className="w-3 h-3 text-ink-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-ink-300">{a.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <StatusBadge status={a.decision} />
                      {a.decidedAt && (
                        <span className="text-xs text-ink-500">
                          {formatDistanceToNow(new Date(a.decidedAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Action Panel */}
          {myApproval && (
            <div className="card p-5 mt-4 border-amber-500/20 animate-slide-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="font-display font-semibold text-amber-400 text-sm">Action Required — Stage {wf.currentStage}</p>
              </div>

              {!showForm ? (
                <div className="flex gap-3">
                  <button onClick={() => { setDecision('APPROVED'); setShowForm(true); }}
                    className="btn-success flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => { setDecision('REJECTED'); setShowForm(true); }}
                    className="btn-danger flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button onClick={() => setDecision('APPROVED')}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        decision === 'APPROVED' ? 'bg-jade-500/20 border-jade-500/40 text-jade-400' : 'bg-ink-700 border-ink-600 text-ink-400'
                      }`}>
                      ✓ Approve
                    </button>
                    <button onClick={() => setDecision('REJECTED')}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        decision === 'REJECTED' ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-ink-700 border-ink-600 text-ink-400'
                      }`}>
                      ✕ Reject
                    </button>
                  </div>
                  <textarea
                    value={comments} onChange={e => setComments(e.target.value)}
                    placeholder="Add comments (optional)..."
                    rows={3} className="input resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleDecide} disabled={decideMutation.isPending}
                      className="btn-primary flex items-center gap-2">
                      {decideMutation.isPending ? 'Submitting...' : `Submit ${decision}`}
                    </button>
                    <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-ink-700">
              <Activity className="w-4 h-4 text-sky-400" />
              <h2 className="font-display font-semibold text-ink-100 text-sm">Activity Log</h2>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-[500px] overflow-y-auto">
              {wf.history?.length > 0 ? wf.history.map(log => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5
                      ${log.event === 'APPROVED' || log.event === 'COMPLETED' ? 'bg-jade-500' :
                        log.event === 'REJECTED' ? 'bg-rose-500' :
                        log.event === 'STAGE_ADVANCED' ? 'bg-sky-500' :
                        'bg-amber-500'}`}
                    />
                    <div className="w-px flex-1 bg-ink-700/50 mt-1" />
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink-200">{log.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-ink-500">{log.actorName}</p>
                      <p className="text-xs text-ink-600 font-mono">
                        {log.timestamp ? format(new Date(log.timestamp), 'MMM d, HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-ink-500 text-center py-8">No activity recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
