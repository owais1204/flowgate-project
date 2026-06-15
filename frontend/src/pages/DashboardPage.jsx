// src/pages/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { workflowApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard, StatusBadge, PriorityBadge, StageProgress, Spinner, PageHeader } from '../components/ui';
import {
  GitPullRequest, Clock, CheckCircle2, XCircle, FileText,
  ChevronRight, Eye, AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => workflowApi.dashboard().then(r => r.data),
  });

  if (isLoading) return <div className="p-8"><Spinner /></div>;

  const stats = [
    { label: 'Total Workflows',   value: data?.totalWorkflows  || 0, icon: GitPullRequest, color: 'ink'  },
    { label: 'Pending Review',    value: data?.pendingCount    || 0, icon: Clock,           color: 'amber' },
    { label: 'In Review',         value: data?.inReviewCount   || 0, icon: Eye,             color: 'sky'   },
    { label: 'Approved',          value: data?.approvedCount   || 0, icon: CheckCircle2,    color: 'jade'  },
    { label: 'Rejected',          value: data?.rejectedCount   || 0, icon: XCircle,         color: 'rose'  },
    { label: 'Drafts',            value: data?.draftCount      || 0, icon: FileText,        color: 'ink'   },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]} ✦`}
        subtitle="Here's what needs your attention today."
        actions={
          <Link to="/workflows/new" className="btn-primary">
            + New Request
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Workflows */}
        <div className="xl:col-span-3">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700">
              <h2 className="font-display font-semibold text-ink-100">Recent Workflows</h2>
              <Link to="/workflows" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-ink-700/50">
              {(data?.recentWorkflows || []).map(wf => (
                <Link
                  key={wf.id}
                  to={`/workflows/${wf.id}`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-ink-700/30 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-100 group-hover:text-amber-300 transition-colors truncate">
                      {wf.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <StatusBadge status={wf.status} />
                      <PriorityBadge priority={wf.priority} />
                      <span className="text-xs text-ink-500">{wf.category}</span>
                    </div>
                    <div className="mt-2 max-w-xs">
                      <StageProgress current={wf.currentStage} total={wf.totalStages} />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-ink-500">
                      {wf.createdAt ? formatDistanceToNow(new Date(wf.createdAt), { addSuffix: true }) : '—'}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">{wf.submitterName}</p>
                  </div>
                </Link>
              ))}
              {(!data?.recentWorkflows?.length) && (
                <p className="px-6 py-8 text-sm text-ink-500 text-center">No workflows yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* My Pending Approvals */}
        <div className="xl:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700">
              <h2 className="font-display font-semibold text-ink-100">My Approvals</h2>
              {data?.myPendingApprovals?.length > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  {data.myPendingApprovals.length} pending
                </span>
              )}
            </div>
            <div className="divide-y divide-ink-700/50">
              {(data?.myPendingApprovals || []).map(a => (
                <div key={a.id} className="px-6 py-4">
                  <p className="text-sm font-medium text-ink-200 mb-1">{a.stageName}</p>
                  <div className="flex items-center justify-between">
                    <span className="badge-pending">Stage {a.stage}</span>
                    <span className="text-xs text-ink-500">Pending</span>
                  </div>
                </div>
              ))}
              {(!data?.myPendingApprovals?.length) && (
                <div className="px-6 py-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-jade-500/40 mx-auto mb-2" />
                  <p className="text-sm text-ink-500">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
