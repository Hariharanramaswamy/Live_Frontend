import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getMe();
        // API is expected to return { user: { name, email, ... } }
        setUser(res.data.user ?? res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid — force logout
          handleLogout();
        } else {
          setError('Could not load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const greeting = getGreeting();

  return (
    <div className="dashboard-page">
      {/* Top navigation bar */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-icon small">✦</div>
          <span className="brand-name">Fortend</span>
        </div>
        <button
          id="logout-btn"
          className="btn-logout"
          onClick={handleLogout}
          title="Sign out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <div className="dashboard-loading">
            <span className="spinner large" />
            <p>Loading your dashboard…</p>
          </div>
        ) : error ? (
          <div className="alert alert-error center">{error}</div>
        ) : (
          <>
            {/* Hero welcome section */}
            <section className="welcome-section">
              <div className="welcome-badge">{greeting.emoji}</div>
              <h2 className="welcome-heading">
                {greeting.label},{' '}
                <span className="highlight">{user?.name ?? 'there'}</span>!
              </h2>
              <p className="welcome-sub">
                You&apos;re signed in as{' '}
                <strong>{user?.email ?? '—'}</strong>
              </p>
            </section>

            {/* Stats / info cards */}
            <section className="card-grid">
              <div className="info-card">
                <div className="info-card-icon">👤</div>
                <div>
                  <p className="info-card-label">Account</p>
                  <p className="info-card-value">{user?.name ?? '—'}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">📧</div>
                <div>
                  <p className="info-card-label">Email</p>
                  <p className="info-card-value">{user?.email ?? '—'}</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-icon">🔐</div>
                <div>
                  <p className="info-card-label">Session</p>
                  <p className="info-card-value">Active</p>
                </div>
              </div>
            </section>

            {/* Activity placeholder */}
            <section className="activity-section">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-empty">
                <span>📭</span>
                <p>No recent activity to show.</p>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Good morning', emoji: '☀️' };
  if (hour < 18) return { label: 'Good afternoon', emoji: '🌤️' };
  return { label: 'Good evening', emoji: '🌙' };
}
