import { useState } from 'react';
import { useApp } from '../store';

export default function Journal() {
  const { journal, books, addJournalEntry } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [pagesRead, setPagesRead] = useState(30);
  const [minutesRead, setMinutesRead] = useState(30);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const readingBooks = books.filter(b => b.status === 'reading' || b.status === 'read');
  const sortedEntries = [...journal].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAdd = () => {
    if (!selectedBookId) return;
    addJournalEntry({
      id: Date.now().toString(),
      bookId: selectedBookId,
      date,
      pagesRead,
      minutesRead,
      note: note.trim() || undefined,
    });
    setShowAdd(false);
    setNote('');
    setPagesRead(30);
    setMinutesRead(30);
  };

  // Calculate total stats
  const totalPages = journal.reduce((s, e) => s + e.pagesRead, 0);
  const totalMinutes = journal.reduce((s, e) => s + e.minutesRead, 0);
  const totalEntries = journal.length;
  const avgPagesPerDay = totalEntries > 0 ? Math.round(totalPages / totalEntries) : 0;

  // Reading streak
  const dates = [...new Set(journal.map(e => e.date))].sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  if (dates.length > 0 && dates[0] === today) {
    streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const d1 = new Date(dates[i - 1]);
      const d2 = new Date(dates[i]);
      const diff = (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.3rem' }}>
        <h2 style={{ fontSize: '0.8rem', color: 'var(--heading)' }}>📓 Журнал чтения</h2>
        <button onClick={() => setShowAdd(!showAdd)} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>+ Запись</button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.2rem', marginBottom: '0.4rem' }}>
        {[
          { label: 'Записей', value: totalEntries, emoji: '📝' },
          { label: 'Страниц', value: totalPages.toLocaleString(), emoji: '📄' },
          { label: 'Минут', value: totalMinutes.toLocaleString(), emoji: '⏱' },
          { label: 'Ср. в день', value: `${avgPagesPerDay} стр.`, emoji: '📊' },
          { label: 'Серия', value: `${streak} дн.`, emoji: '🔥' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px',
            padding: '0.2rem', textAlign: 'center', boxShadow: 'var(--shadow)'
          }}>
            <span style={{ fontSize: '0.5rem' }}>{s.emoji}</span>
            <div style={{ fontSize: '0.45rem', color: 'var(--heading)', fontWeight: 'bold' }}>{s.value}</div>
            <div style={{ fontSize: '0.25rem', color: 'var(--text-soft)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Entry Form */}
      {showAdd && (
        <div className="animate-slide-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.4rem', marginBottom: '0.4rem', boxShadow: 'var(--shadow)' }}>
          <h4 style={{ fontSize: '0.42rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>Новая запись</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.2rem' }}>
            <div>
              <label style={labelStyle}>Книга</label>
              <select value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                <option value="">Выберите книгу...</option>
                {readingBooks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Дата</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}>Страниц прочитано</label>
              <input type="number" value={pagesRead} onChange={e => setPagesRead(Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label style={labelStyle}>Минут чтения</label>
              <input type="number" value={minutesRead} onChange={e => setMinutesRead(Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>
          <div style={{ marginTop: '0.2rem' }}>
            <label style={labelStyle}>Заметка (необязательно)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ваши мысли о прочитанном..." style={{ ...inputStyle, width: '100%', minHeight: '1.5rem', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
            <button onClick={handleAdd} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>✓ Сохранить</button>
            <button onClick={() => setShowAdd(false)} style={btnStyle}>Отмена</button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ position: 'relative', paddingLeft: '0.5rem' }}>
        <div style={{ position: 'absolute', left: '0.15rem', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
        {sortedEntries.map((entry, i) => {
          const book = books.find(b => b.id === entry.bookId);
          return (
            <div key={entry.id} className="animate-slide-in-right" style={{
              position: 'relative', marginBottom: '0.3rem', paddingLeft: '0.3rem',
              animationDelay: `${i * 0.05}s`, animationFillMode: 'both'
            }}>
              <div style={{
                position: 'absolute', left: '-0.4rem', top: '0.15rem',
                width: '0.3rem', height: '0.3rem', borderRadius: '50%',
                background: 'var(--accent-blue)', border: '2px solid var(--card)'
              }} />
              <div style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px',
                padding: '0.3rem', boxShadow: 'var(--shadow)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                  <span style={{ fontSize: '0.38rem', color: 'var(--heading)', fontWeight: 'bold' }}>
                    {book?.title || 'Неизвестная книга'}
                  </span>
                  <span style={{ fontSize: '0.28rem', color: 'var(--text-soft)' }}>{entry.date}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.32rem', color: 'var(--text-soft)' }}>
                  <span>📄 {entry.pagesRead} стр.</span>
                  <span>⏱ {entry.minutesRead} мин.</span>
                </div>
                {entry.note && (
                  <p style={{ fontSize: '0.32rem', color: 'var(--text-soft)', marginTop: '0.1rem', fontStyle: 'italic' }}>
                    💭 {entry.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {journal.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-soft)', fontSize: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>📓</span>
          Записей пока нет. Начните вести журнал чтения!
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.15rem 0.35rem', borderRadius: '10px', border: '1px solid var(--border)',
  background: 'var(--bg-soft)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.35rem', transition: 'all 0.2s',
};
const inputStyle: React.CSSProperties = {
  padding: '0.15rem 0.25rem', borderRadius: '8px', border: '1px solid var(--border)',
  background: 'var(--card)', color: 'var(--text)', fontSize: '0.35rem', outline: 'none',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.3rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.05rem',
};
