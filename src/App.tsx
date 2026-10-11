import { useState } from 'react';
import { AppProvider, useApp } from './store';
import Library from './components/Library';
import SeriesView from './components/Series';
import Goals from './components/Goals';
import Journal from './components/Journal';
import BookClubs from './components/BookClubs';
import Settings from './components/Settings';

type Page = 'library' | 'series' | 'goals' | 'journal' | 'clubs' | 'settings';

const navItems: { id: Page; label: string; emoji: string }[] = [
  { id: 'library', label: 'Библиотека', emoji: '📚' },
  { id: 'series', label: 'Серии', emoji: '📖' },
  { id: 'goals', label: 'Цели', emoji: '🎯' },
  { id: 'journal', label: 'Журнал', emoji: '📓' },
  { id: 'clubs', label: 'Клубы', emoji: '👥' },
  { id: 'settings', label: 'Настройки', emoji: '⚙️' },
];

function AppContent() {
  const [page, setPage] = useState<Page>('library');
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, setDarkMode, books, getStats } = useApp();
  const stats = getStats();

  const renderPage = () => {
    switch (page) {
      case 'library': return <Library />;
      case 'series': return <SeriesView />;
      case 'goals': return <Goals />;
      case 'journal': return <Journal />;
      case 'clubs': return <BookClubs />;
      case 'settings': return <Settings />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        padding: '0.3rem 0.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.6rem',
              display: 'none', padding: '0.1rem',
            }} className="mobile-menu-btn">☰</button>
            <span style={{ fontSize: '0.8rem' }}>📚</span>
            <h1 style={{ fontSize: '0.6rem', color: 'var(--heading)', fontWeight: 'normal' }}>
              Моя библиотека
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.3rem', color: 'var(--text-soft)' }}>
              🔥 {stats.streak} дн.
            </span>
            <button onClick={() => setDarkMode(!darkMode)} style={{
              background: 'var(--bg-soft)', border: '1px solid var(--border)',
              borderRadius: '50%', width: '1rem', height: '1rem',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.4rem', transition: 'all 0.3s',
            }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Sidebar Navigation */}
        <nav style={{
          width: '7rem',
          padding: '0.3rem',
          borderRight: '1px solid var(--border)',
          background: 'var(--card)',
          minHeight: 'calc(100vh - 2rem)',
          flexShrink: 0,
        }} className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setMenuOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                width: '100%',
                padding: '0.2rem 0.25rem',
                borderRadius: '10px',
                border: 'none',
                background: page === item.id ? 'var(--primary)' : 'transparent',
                color: page === item.id ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.35rem',
                marginBottom: '0.08rem',
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '0.5rem' }}>{item.emoji}</span>
              <span>{item.label}</span>
              {item.id === 'library' && (
                <span style={{
                  marginLeft: 'auto',
                  background: page === item.id ? 'rgba(255,255,255,0.3)' : 'var(--bg-soft)',
                  borderRadius: '6px',
                  padding: '0.02rem 0.12rem',
                  fontSize: '0.25rem',
                }}>{books.length}</span>
              )}
            </button>
          ))}

          {/* Quick Stats in Sidebar */}
          <div style={{
            marginTop: '0.5rem',
            padding: '0.2rem',
            background: 'var(--bg-soft)',
            borderRadius: '10px',
            fontSize: '0.28rem',
          }}>
            <div style={{ color: 'var(--text-soft)', marginBottom: '0.1rem', fontWeight: 'bold' }}>Быстрая статистика</div>
            <div style={{ color: 'var(--text-soft)' }}>📚 {stats.totalBooksRead} прочитано</div>
            <div style={{ color: 'var(--text-soft)' }}>📖 {books.filter(b => b.status === 'reading').length} читается</div>
            <div style={{ color: 'var(--text-soft)' }}>📄 {stats.totalPagesRead.toLocaleString()} стр.</div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        padding: '0.15rem',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }} className="mobile-nav">
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {navItems.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.02rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: page === item.id ? 'var(--primary)' : 'var(--text-soft)',
                fontSize: '0.22rem',
                padding: '0.1rem',
              }}
            >
              <span style={{ fontSize: '0.5rem' }}>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-nav { display: none !important; }
          .mobile-nav { display: block !important; }
          .mobile-menu-btn { display: block !important; }
          main { padding-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
