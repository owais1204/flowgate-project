// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';

const DEMO_USERS = [
  { name: 'Alice Johnson (Admin)',    email: 'alice@company.com',  role: 'ADMIN' },
  { name: 'Bob Martinez (Manager)',   email: 'bob@company.com',    role: 'MANAGER' },
  { name: 'Frank Brown (Submitter)',  email: 'frank@company.com',  role: 'SUBMITTER' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-ink-800 border-r border-ink-700 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ink-700/30 rounded-full blur-2xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-ink-900" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl text-ink-50">FlowGate</span>
          </div>
          <h2 className="font-display font-bold text-4xl text-ink-50 leading-tight mb-4">
            Approve with<br />
            <span className="text-amber-400">clarity.</span><br />
            Track with<br />
            <span className="text-jade-400">confidence.</span>
          </h2>
          <p className="text-ink-400 text-base leading-relaxed max-w-sm">
            Multi-level workflow approvals with intelligent semantic search powered by vector embeddings.
          </p>
        </div>

        <div className="relative space-y-3">
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wider mb-2">Demo Accounts</p>
          {DEMO_USERS.map(u => (
            <button
              key={u.email}
              onClick={() => { setEmail(u.email); setPassword('demo'); }}
              className="w-full flex items-center justify-between p-3 bg-ink-700/50 hover:bg-ink-700 border border-ink-600/50 hover:border-amber-500/30 rounded-xl transition-all duration-200 text-left group"
            >
              <div>
                <p className="text-sm font-medium text-ink-200 group-hover:text-ink-50">{u.name}</p>
                <p className="text-xs text-ink-500">{u.email}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-ink-500 group-hover:text-amber-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink-900" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-ink-50">FlowGate</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-ink-50 mb-2">Sign in</h1>
          <p className="text-ink-400 mb-8 text-sm">Access your workflow approval portal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required
                  className="input pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="input pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-xs text-ink-500 mt-6 text-center">
            Use any demo account from the left panel to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
