'use client';

import { useState, useEffect } from 'react';
import { ScoreRecord } from '@/domain/scores/score.types';
import { Trophy, Calendar, Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export default function ScoresManagementPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newScoreVal, setNewScoreVal] = useState<number | ''>('');
  const [newDateVal, setNewDateVal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [evictionNotice, setEvictionNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchScores = async () => {
    try {
      const email = user?.email || 'agchoudhari2110@gmail.com';
      const res = await fetch(`/api/subscriber/data?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data && data.scores) {
        setScores(data.scores);
      }
    } catch (err) {
      console.error('Error fetching scores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, [user?.email]);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setEvictionNotice(null);

    if (newScoreVal === '' || !newDateVal) {
      setErrorMsg('Please enter both a score (1–45) and a date.');
      return;
    }

    const numScore = Number(newScoreVal);
    if (isNaN(numScore) || numScore < 1 || numScore > 45) {
      setErrorMsg('Stableford score must be between 1 and 45.');
      return;
    }

    setSubmitting(true);
    try {
      const email = user?.email || 'agchoudhari2110@gmail.com';
      const payload: any = {
        email,
        score: numScore,
        scoreDate: newDateVal,
      };

      if (editingId) {
        payload.scoreId = editingId;
      }

      const res = await fetch('/api/subscriber/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save score');
      }

      setSuccessMsg(editingId ? 'Score updated successfully!' : 'Score recorded successfully!');
      if (result.evictionNotice) {
        setEvictionNotice(result.evictionNotice);
      }

      setEditingId(null);
      setNewScoreVal('');
      await fetchScores();
    } catch (err: any) {
      setErrorMsg(err.message || 'Validation error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInit = (record: ScoreRecord) => {
    setEditingId(record.id);
    setNewScoreVal(record.score);
    setNewDateVal(record.scoreDate);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewScoreVal('');
    setNewDateVal(new Date().toISOString().split('T')[0]);
  };

  const handleDelete = async (id: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const email = user?.email || 'agchoudhari2110@gmail.com';
      const res = await fetch('/api/subscriber/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, action: 'delete', scoreId: id }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete score');
      }

      setSuccessMsg('Score deleted.');
      await fetchScores();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete score');
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Manage Your Golf Scores</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Enter your Stableford scores (1–45). Only your newest 5 scores are retained for draw eligibility.
        </p>
      </div>

      {/* Error, Success & Eviction Alerts */}
      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle2 style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {evictionNotice && (
        <div style={{ background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.3)', color: 'var(--accent-cyan)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Trophy style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          <span>{evictionNotice}</span>
        </div>
      )}

      {/* Score Entry / Edit Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          {editingId ? 'Edit Existing Score' : 'Add New Score'}
        </h3>

        <form onSubmit={handleAddOrUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Stableford Score (1 - 45)
            </label>
            <input
              type="number"
              min={1}
              max={45}
              required
              value={newScoreVal}
              onChange={(e) => setNewScoreVal(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 36"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Score Date
            </label>
            <input
              type="date"
              required
              value={newDateVal}
              onChange={(e) => setNewDateVal(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Plus style={{ width: '18px', height: '18px' }} />
              {submitting ? 'Saving...' : editingId ? 'Update Score' : 'Add Score'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Current Retained 5 Scores Table */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>
            Retained Scores ({scores.length}/5)
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            Sorted newest first
          </span>
        </div>

        {loading ? (
          <div style={{ color: 'var(--text-subtle)', padding: '1rem', textAlign: 'center' }}>Loading your scores...</div>
        ) : scores.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)' }}>
              No scores recorded yet in your account. Enter your latest Stableford score above.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {scores.map((s, idx) => (
              <div
                key={s.id}
                className="glass-card"
                style={{
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="score-pill">{s.score}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Stableford Score: {s.score}</div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} /> {s.scoreDate} {idx === 0 && <span className="badge badge-cyan" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Newest</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditInit(s)} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem' }} title="Edit score">
                    <Edit2 style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.75rem' }} title="Delete score">
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
