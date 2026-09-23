'use client';

import { useState, useEffect } from 'react';
import { ScoreRecord } from '@/domain/scores/score.types';
import { Trophy, Calendar, Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { ScoreService } from '@/services/score.service';

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

  const userEmail = user?.email || 'agchoudhari2110@gmail.com';

  const fetchScores = async () => {
    // 1. Instantly load locally persisted scores from ScoreService
    const localScores = ScoreService.getScores(userEmail);
    setScores(localScores);
    setLoading(false);

    // 2. Optimistically synchronize with API if online
    try {
      const res = await fetch(`/api/subscriber/data?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.scores && data.scores.length > 0) {
          // Merge API scores if fresher
          setScores(data.scores);
          ScoreService.saveScores(data.scores, userEmail);
        }
      }
    } catch (err) {
      // Graceful local operation
    }
  };

  useEffect(() => {
    fetchScores();
  }, [userEmail]);

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

    // Check for duplicate date in local scores
    const duplicate = scores.find((s) => s.scoreDate === newDateVal && s.id !== editingId);
    if (duplicate) {
      setErrorMsg(`A score has already been recorded for ${newDateVal}. Duplicate scores on the same date are not allowed.`);
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Edit existing score via ScoreService
        const res = ScoreService.editScore(userEmail, editingId, numScore, newDateVal);
        setScores(res.retainedScores);
        setSuccessMsg('Score updated successfully!');
      } else {
        // Add new score via ScoreService (enforces rolling 5 rule)
        const res = ScoreService.addScore(userEmail, numScore, newDateVal);
        setScores(res.retainedScores);
        setSuccessMsg('Score recorded successfully!');
        if (res.evictionNotice) {
          setEvictionNotice(res.evictionNotice);
        }
      }

      // Sync to API in background (non-blocking)
      fetch('/api/subscriber/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          score: numScore,
          scoreDate: newDateVal,
          scoreId: editingId,
        }),
      }).catch(() => {});

      setEditingId(null);
      setNewScoreVal('');
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
      const res = ScoreService.deleteScore(userEmail, id);
      setScores(res.retainedScores);
      setSuccessMsg('Score deleted successfully.');

      // Sync to API in background
      fetch('/api/subscriber/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, action: 'delete', scoreId: id }),
      }).catch(() => {});
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete score.');
    }
  };

  return (
    <div style={{ display: 'grid', gap: '2.5rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Score Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Record your latest Stableford golf scores (1–45). Only your newest 5 scores are retained for monthly draw participation.
        </p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          <span>{successMsg}</span>
        </div>
      )}

      {evictionNotice && (
        <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: 'var(--accent-cyan)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Trophy style={{ width: '18px', height: '18px' }} />
          <span>{evictionNotice}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#F87171', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle style={{ width: '18px', height: '18px' }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Score Entry / Edit Form */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus style={{ width: '18px', height: '18px', color: 'var(--accent-cyan)' }} />
          {editingId ? 'Edit Recorded Score' : 'Record New Stableford Score'}
        </h3>

        <form onSubmit={handleAddOrUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Stableford Score (1 – 45)
            </label>
            <input
              type="number"
              min={1}
              max={45}
              required
              value={newScoreVal}
              onChange={(e) => setNewScoreVal(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 38"
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Round Date (One score per date)
            </label>
            <input
              type="date"
              required
              value={newDateVal}
              onChange={(e) => setNewDateVal(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {submitting ? 'Saving...' : editingId ? 'Update Score' : 'Add Score'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Retained Scores Table (Max 5, Newest First) */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem' }}>Retained Stableford Scores ({scores.length} / 5)</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Sorted in reverse chronological order (newest first).
            </p>
          </div>
          <span className={scores.length === 5 ? 'badge badge-active' : 'badge badge-warning'}>
            {scores.length === 5 ? '✓ 5 Scores Ready for Draw' : `${5 - scores.length} more needed for ticket`}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading your scores...
          </div>
        ) : scores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No scores added yet. Enter your first score above!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {scores.map((s, index) => (
              <div
                key={s.id || index}
                className="glass-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderLeft: index === 0 ? '4px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div className="score-pill">{s.score}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Stableford Points: {s.score}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} /> {s.scoreDate}
                      {index === 0 && <span className="badge badge-cyan" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>Latest</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditInit(s)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="Edit score"
                  >
                    <Edit2 style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.6rem', color: '#F87171' }}
                    title="Delete score"
                  >
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
