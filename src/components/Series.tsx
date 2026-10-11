import { useState } from 'react';
import { useApp } from '../store';
import { SeriesStatus } from '../types';

const seriesStatusLabels: Record<SeriesStatus, string> = {
  active: '📚 Активная',
  paused: '⏸ На паузе',
  abandoned: '❌ Брошено',
};

const seriesStatusColors: Record<SeriesStatus, string> = {
  active: 'var(--accent-green)',
  paused: 'var(--accent-blue)',
  abandoned: 'var(--text-soft)',
};

export default function SeriesView() {
  const { series, books, updateSeries } = useApp();
  const [filterStatus, setFilterStatus] = useState<SeriesStatus | 'all'>('all');

  const filtered = series.filter(s => filterStatus === 'all' || s.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.3rem' }}>
        <h2 style={{ fontSize: '0.8rem', color: 'var(--heading)' }}>📚 Серии книг</h2>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} style={{
          padding: '0.15rem 0.3rem', borderRadius: '10px', border: '1px solid var(--border)',
          background: 'var(--card)', color: 'var(--text)', fontSize: '0.35rem'
        }}>
          <option value="all">Все серии</option>
          <option value="active">📚 Активные</option>
          <option value="paused">⏸ На паузе</option>
          <option value="abandoned">❌ Брошенные</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '0.4rem' }}>
        {filtered.map((s, i) => {
          const seriesBooks = books.filter(b => b.seriesId === s.id).sort((a, b) => (a.seriesIndex || 0) - (b.seriesIndex || 0));
          const readBooks = seriesBooks.filter(b => b.status === 'read');
          const readingBooks = seriesBooks.filter(b => b.status === 'reading');
          const nextBook = seriesBooks.find(b => b.status === 'want' || b.status === 'reading');
          const progress = seriesBooks.length > 0 ? (readBooks.length / seriesBooks.length) * 100 : 0;

          return (
            <div key={s.id} className="animate-slide-up" style={{
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '0.5rem', boxShadow: 'var(--shadow)',
              animationDelay: `${i * 0.08}s`, animationFillMode: 'both'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem', flexWrap: 'wrap', gap: '0.2rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.55rem', color: 'var(--heading)', marginBottom: '0.05rem' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.35rem', color: 'var(--text-soft)' }}>{s.author}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.3rem', color: seriesStatusColors[s.status], fontWeight: 'bold' }}>
                    {seriesStatusLabels[s.status]}
                  </span>
                  <select value={s.status} onChange={e => updateSeries(s.id, { status: e.target.value as SeriesStatus })} style={{
                    padding: '0.08rem 0.15rem', borderRadius: '8px', border: '1px solid var(--border)',
                    background: 'var(--bg-soft)', color: 'var(--text)', fontSize: '0.28rem'
                  }}>
                    <option value="active">Активная</option>
                    <option value="paused">На паузе</option>
                    <option value="abandoned">Брошено</option>
                  </select>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.32rem', color: 'var(--text-soft)', marginBottom: '0.05rem' }}>
                  <span>Прочитано {readBooks.length} из {seriesBooks.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-soft)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-green)', borderRadius: '6px', transition: 'width 0.5s' }} />
                </div>
              </div>

              {/* Next book */}
              {nextBook && (
                <div style={{ fontSize: '0.32rem', color: 'var(--accent-blue)', marginBottom: '0.2rem', padding: '0.1rem 0.2rem', background: 'var(--bg-soft)', borderRadius: '8px' }}>
                  📖 Следующая: <strong>{nextBook.title}</strong> (#{nextBook.seriesIndex})
                </div>
              )}

              {/* Books list */}
              <div style={{ display: 'flex', gap: '0.15rem', flexWrap: 'wrap' }}>
                {seriesBooks.map(b => (
                  <div key={b.id} style={{
                    padding: '0.1rem 0.2rem', borderRadius: '8px', fontSize: '0.28rem',
                    background: b.status === 'read' ? 'var(--accent-green)' : b.status === 'reading' ? 'var(--accent-blue)' : 'var(--bg-soft)',
                    color: b.status === 'read' || b.status === 'reading' ? '#fff' : 'var(--text-soft)',
                    opacity: b.status === 'want' ? 0.7 : 1
                  }}>
                    #{b.seriesIndex} {b.title.length > 20 ? b.title.slice(0, 20) + '...' : b.title}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.3rem', color: 'var(--text-soft)' }}>
                <span>✅ {readBooks.length} прочитано</span>
                <span>📖 {readingBooks.length} читается</span>
                <span>💭 {seriesBooks.filter(b => b.status === 'want').length} в планах</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-soft)', fontSize: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>📚</span>
          Серии не найдены
        </div>
      )}
    </div>
  );
}
