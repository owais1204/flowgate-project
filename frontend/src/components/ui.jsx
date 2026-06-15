// src/components/ui.jsx
import { Clock, CheckCircle2, XCircle, FileText, Eye, AlertCircle } from 'lucide-react';

export function StatusBadge({ status }) {
  const cfg = {
    PENDING:   { cls: 'badge-pending',  icon: Clock,         label: 'Pending' },
    IN_REVIEW: { cls: 'badge-review',   icon: Eye,           label: 'In Review' },
    APPROVED:  { cls: 'badge-approved', icon: CheckCircle2,  label: 'Approved' },
    REJECTED:  { cls: 'badge-rejected', icon: XCircle,       label: 'Rejected' },
    DRAFT:     { cls: 'badge-draft',    icon: FileText,       label: 'Draft' },
    CANCELLED: { cls: 'badge-draft',    icon: AlertCircle,   label: 'Cancelled' },
  };
  const { cls, icon: Icon, label } = cfg[status] || cfg['DRAFT'];
  return (
    <span className={cls}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = {
    LOW:    'text-ink-400 bg-ink-700/50',
    NORMAL: 'text-sky-400 bg-sky-500/10',
    HIGH:   'text-amber-400 bg-amber-500/10',
    URGENT: 'text-rose-400 bg-rose-500/10 animate-pulse-slow',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cfg[priority] || cfg.NORMAL}`}>
      {priority}
    </span>
  );
}

export function StageProgress({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < current - 1 ? 'bg-jade-500' :
            i === current - 1 ? 'bg-amber-400' :
            'bg-ink-600'
          }`}
        />
      ))}
      <span className="text-xs text-ink-400 ml-1 font-mono whitespace-nowrap">
        {current}/{total}
      </span>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink-50 tracking-tight">{title}</h1>
        {subtitle && <p className="text-ink-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, color = 'amber', trend }) {
  const colors = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    jade:  'text-jade-400 bg-jade-500/10 border-jade-500/20',
    rose:  'text-rose-400 bg-rose-500/10 border-rose-500/20',
    sky:   'text-sky-400 bg-sky-500/10 border-sky-500/20',
    ink:   'text-ink-300 bg-ink-700/50 border-ink-600/50',
  };
  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-display font-bold text-ink-50">{value}</p>
      <p className="text-sm text-ink-400 mt-1">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ink-500" />
      </div>
      <h3 className="font-display font-semibold text-ink-200 mb-1">{title}</h3>
      <p className="text-sm text-ink-500 max-w-xs">{subtitle}</p>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-ink-600 border-t-amber-400 rounded-full animate-spin" />
    </div>
  );
}
