// src/pages/SearchPage.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchApi } from '../services/api';
import { StatusBadge, EmptyState } from '../components/ui';
import toast from 'react-hot-toast';

import {
  Search,
  Sparkles,
  ChevronRight,
  Loader2
} from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Finance',
  'IT',
  'Budget',
  'Approval',
  'Security'
];

export default function SearchPage() {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (q = query) => {

    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);

    try {

      const { data } = await searchApi.quick(
        q,
        { limit: 10 }
      );

      setResults(data);

    } catch (error) {

      console.error(error);

      toast.error(
        'Search failed. Check backend and MongoDB.'
      );

      setResults([]);
    }
    finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (q) => {
    setQuery(q);
    handleSearch(q);
  };

  return (
    <div className="p-8 max-w-5xl">

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3 mb-2">

          <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>

          <h1 className="font-display font-bold text-2xl text-ink-50 tracking-tight">
            Smart Search
          </h1>

        </div>

        <p className="text-ink-400 text-sm">
          Powered by MongoDB Smart Search and indexed workflow documents.
        </p>

      </div>

      {/* SEARCH BOX */}

      <div className="card p-5 mb-6">

        <div className="flex gap-3">

          <div className="relative flex-1">

            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && handleSearch()
              }
              placeholder='Search workflows...'
              className="input pl-10 text-sm"
            />

          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >

            {
              loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Search className="w-4 h-4" />
            }

            Search

          </button>

        </div>

        {/* EXAMPLES */}

        <div className="mt-4 pt-4 border-t border-ink-700">

          <p className="text-xs text-ink-500 mb-2.5">
            Example Searches
          </p>

          <div className="flex flex-wrap gap-2">

            {
              EXAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleExampleClick(q)}
                  className="text-xs px-3 py-1.5 bg-ink-700 hover:bg-ink-600 border border-ink-600 text-ink-300 rounded-full"
                >
                  {q}
                </button>
              ))
            }

          </div>

        </div>

        {/* MONGODB INFO */}

        <div className="mt-5">

          <p className="text-xs text-ink-500 mb-2">
            MongoDB Collections
          </p>

          <div className="flex gap-2">

            <span className="px-3 py-1 rounded-lg bg-green-900/30 text-green-300 text-xs">
              workflow_embeddings
            </span>

            <span className="px-3 py-1 rounded-lg bg-blue-900/30 text-blue-300 text-xs">
              smart-search
            </span>

          </div>

        </div>

      </div>

      {/* LOADING */}

      {
        loading && (
          <div className="flex flex-col items-center justify-center py-20 text-ink-500">

            <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-3" />

            <p className="text-sm">
              Searching MongoDB...
            </p>

          </div>
        )
      }

      {/* RESULTS */}

      {
        !loading &&
        searched &&

        <>

          <div className="flex items-center justify-between mb-4">

            <p className="text-sm text-ink-400">

              <span className="text-ink-200 font-medium">
                {results.length}
              </span>

              {' '}results for{' '}

              <span className="text-sky-400">
                "{query}"
              </span>

            </p>

          </div>

          {
            results.length === 0 ? (

              <EmptyState
                icon={Search}
                title="No matching workflows"
                subtitle="Try another search keyword."
              />

            ) : (

              <div className="space-y-3">

                {
                  results.map((r) => (

                    <Link
                      key={r.id}
                      to={`/workflows/${r.workflowId}`}
                      className="card p-5 flex items-start gap-4 hover:border-sky-500/30 block group"
                    >

                      {/* WORKFLOW ID */}

                      <div className="flex-shrink-0 w-14 text-center">

                        <div className="text-lg font-display font-bold text-sky-400">
                          #{r.workflowId}
                        </div>

                        <div className="text-xs text-ink-600">
                          Workflow
                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="flex-1">

                        <div className="flex items-start justify-between gap-3 mb-2">

                          <h3 className="font-display font-semibold text-ink-100 group-hover:text-sky-300">

                            {r.title}

                          </h3>

                          <StatusBadge
                            status={r.status}
                          />

                        </div>

                        <p className="text-sm text-ink-400 mb-3">

                          {r.description}

                        </p>

                        <div className="flex flex-wrap gap-2">

                          <span className="text-xs px-2 py-1 bg-ink-700 text-ink-300 rounded-lg">
                            {r.category}
                          </span>

                          <span className="text-xs px-2 py-1 bg-sky-900/40 text-sky-300 rounded-lg">
                            {r.priority}
                          </span>

                          <span className="text-xs px-2 py-1 bg-emerald-900/40 text-emerald-300 rounded-lg">
                            {r.status}
                          </span>

                        </div>

                      </div>

                      <ChevronRight className="w-4 h-4 text-ink-600 group-hover:text-sky-400 mt-1" />

                    </Link>

                  ))
                }

              </div>

            )
          }

        </>
      }

      {/* INITIAL SCREEN */}

      {
        !searched && (

          <div className="card p-8 text-center border-dashed">

            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">

              <Sparkles className="w-7 h-7 text-sky-400" />

            </div>

            <h3 className="font-display font-semibold text-ink-200 mb-2">
              MongoDB Smart Search
            </h3>

            <p className="text-sm text-ink-500 max-w-sm mx-auto leading-relaxed">
              Search workflow documents stored in MongoDB and retrieve matching workflow requests instantly.
            </p>

          </div>

        )
      }

    </div>
  );
}