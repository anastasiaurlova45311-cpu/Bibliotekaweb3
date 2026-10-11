import { useState } from 'react';
import { useApp } from '../store';
import { Goal } from '../types';

export default function Goals() {
  const { goals, addGoal, deleteGoal, getStats, books, journal } = useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalType, setGoalType] = useState<Goal['type']>('books');
  const [goalTarget, setGoalTarget] = useState(24);
  const [goalPeriod, setGoalPeriod] = useState<Goal['period']>('year');

  const stats = getStats();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;

  const getProgress = (goal: Goal) => {
    let current = 0;
    const yearGoals = goal.period === 'year';
    const monthGoals = goal.period === 'month' && goal.month === thisMonth;
    const weekGoals = goal.period === 'week';

    if (goal.type === 'books') {
      if (yearGoals) current = stats.booksThisYear;
      else if (monthGoals) current = books.filter(b => b.status === 'read' && b.dateFinished && new Date(b.dateFinished).getMonth() + 1 === thisMonth && new Date(b.dateFinished).getFullYear() === thisYear).length;
      else current = stats.booksThisYear;
    } else if (goal.type === 'pages') {
      if (yearGoals) current = stats.pagesThisYear;
      else if (monthGoals) current = journal.filter(e => new Date(e.date).getMonth() + 1 === thisMonth && new Date(e.date).getFullYear() === thisYear).reduce((s, e) => s + e.pagesRead, 0);
      else current = stats.pagesThisYear;
    } else if (goal.type === 'minutes') {
      if (yearGoals) current = stats.minutesThisYear;
      else if (monthGoals) current = journal.filter(e => new Date(e.date).getMonth() + 1 === thisMonth && new Date(e.date).getFullYear() === thisYear).reduce((s, e) => s + e.minutesRead, 0);
      else current = stats.minutesThisYear;
    } else if (goal.type === 'authors') {
      current = stats.uniqueAuthors.length;
    }
    return Math.min((current / goal.target) * 100, 100);
  };

  const getCurrentValue = (goal: Goal) => {
    if (goal.type === 'books') {
      if (goal.period === 'year') return stats.booksThisYear;
      if (goal.period === 'month') return books.filter(b => b.status === 'read' && b.dateFinished && new Date(b.dateFinished).getMonth() + 1 === thisMonth && new Date(b.dateFinished).getFullYear() === thisYear).length;
      return stats.booksThisYear;
    }
    if (goal.type === 'pages') {
      if (goal.period === 'year') return stats.pagesThisYear;
      if (goal.period === 'month') return journal.filter(e => new Date(e.date).getMonth() + 1 === thisMonth && new Date(e.date).getFullYear() === thisYear).reduce((s, e) => s + e.pagesRead, 0);
      return stats.pagesThisYear;
    }
    if (goal.type === 'minutes') {
      if (goal.period === 'year') return stats.minutesThisYear;
      if (goal.period === 'month') return journal.filter(e => new Date(e.date).getMonth() + 1 === thisMonth && new Date(e.date).getFullYear() === thisYear).reduce((s, e) => s + e.minutesRead, 0);
      return stats.minutesThisYear;
    }
    if (goal.type === 'authors') return stats.uniqueAuthors.length;
    return 0;
  };

  const typeLabels: Record<Goal['type'], string> = { books: '📚 Книг', pages: '📄 Страниц', minutes: '⏱ Минут чтения', authors: '✍️ Авторов' };
  const periodLabels: Record<Goal['period'], string> = { year: 'в год', month: 'в месяц', week: 'в неделю', custom: 'период' };

  const handleAddGoal = () => {
    addGoal({ id: Date.now().toString(), type: goalType, target: goalTarget, period: goalPeriod, year: thisYear, month: thisMonth });
    setShowAddGoal(false);
  };

  // Monthly reading data for chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthBooks = books.filter(b => b.status === 'read' && b.dateFinished && new Date(b.dateFinished).getMonth() === i && new Date(b.dateFinished).getFullYear() === thisYear).length;
    const monthPages = journal.filter(e => new Date(e.date).getMonth() === i && new Date(e.date).getFullYear() === thisYear).reduce((s, e) => s + e.pagesRead, 0);
    return { month: i + 1, books: monthBooks, pages: monthPages };
  });
  const maxPages = Math.max(...monthlyData.map(d => d.pages), 1);
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.3rem' }}>
        <h2 style={{ fontSize: '0.8rem', color: 'var(--heading)' }}>🎯 Цели и аналитика</h2>
        <button onClick={() => setShowAddGoal(!showAddGoal)} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>+ Новая цель</button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="animate-slide-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.4rem', marginBottom: '0.4rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.2rem' }}>
            <div>
              <label style={labelStyle}>Тип цели</label>
              <select value={goalType} onChange={e => setGoalType(e.target.value as any)} style={inputStyle}>
                <option value="books">📚 Книг</option>
                <option value="pages">📄 Страниц</option>
                <option value="minutes">⏱ Минут чтения</option>
                <option value="authors">✍️ Авторов</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Цель</label>
              <input type="number" value={goalTarget} onChange={e => setGoalTarget(Number(e.target.value))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Период</label>
              <select value={goalPeriod} onChange={e => setGoalPeriod(e.target.value as any)} style={inputStyle}>
                <option value="year">В год</option>
                <option value="month">В месяц</option>
                <option value="week">В неделю</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
            <button onClick={handleAddGoal} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>✓ Создать</button>
            <button onClick={() => setShowAddGoal(false)} style={btnStyle}>Отмена</button>
          </div>
        </div>
      )}

      {/* Goals Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.4rem', marginBottom: '0.5rem' }}>
        {goals.map((goal, i) => {
          const progress = getProgress(goal);
          const current = getCurrentValue(goal);
          return (
            <div key={goal.id} className="animate-slide-up" style={{
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '0.4rem', boxShadow: 'var(--shadow)',
              animationDelay: `${i * 0.08}s`, animationFillMode: 'both'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.42rem', color: 'var(--heading)' }}>{typeLabels[goal.type]}</span>
                <button onClick={() => deleteGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.3rem' }}>✕</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.35rem', marginBottom: '0.1rem' }}>
                <span style={{ color: 'var(--text-soft)' }}>{periodLabels[goal.period]} {thisYear}</span>
                <span style={{ fontWeight: 'bold', color: progress >= 100 ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
                  {current} / {goal.target}
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-soft)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progress}%`, borderRadius: '8px', transition: 'width 0.5s',
                  background: progress >= 100 ? 'var(--accent-green)' : `linear-gradient(90deg, var(--accent-blue), var(--accent-purple))`
                }} />
              </div>
              <div style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginTop: '0.05rem', textAlign: 'right' }}>
                {Math.round(progress)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.3rem', marginBottom: '0.5rem' }}>
        {[
          { label: 'Прочитано книг', value: stats.totalBooksRead, emoji: '📚' },
          { label: 'Страниц прочитано', value: stats.totalPagesRead.toLocaleString(), emoji: '📄' },
          { label: 'Минут чтения', value: stats.totalMinutesRead.toLocaleString(), emoji: '⏱' },
          { label: 'Книг в этом году', value: stats.booksThisYear, emoji: '📅' },
          { label: 'Уникальных авторов', value: stats.uniqueAuthors.length, emoji: '✍️' },
          { label: 'Серия чтения', value: `${stats.streak} дн.`, emoji: '🔥' },
        ].map((stat, i) => (
          <div key={i} className="animate-slide-up" style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px',
            padding: '0.3rem', textAlign: 'center', boxShadow: 'var(--shadow)',
            animationDelay: `${i * 0.06}s`, animationFillMode: 'both'
          }}>
            <span style={{ fontSize: '0.8rem' }}>{stat.emoji}</span>
            <div style={{ fontSize: '0.6rem', color: 'var(--heading)', fontWeight: 'bold' }}>{stat.value}</div>
            <div style={{ fontSize: '0.28rem', color: 'var(--text-soft)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '0.4rem', boxShadow: 'var(--shadow)' }}>
        <h3 style={{ fontSize: '0.5rem', color: 'var(--heading)', marginBottom: '0.3rem' }}>📊 Чтение по месяцам ({thisYear})</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.15rem', height: '3rem', padding: '0 0.2rem' }}>
          {monthlyData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.05rem' }}>
              <div style={{
                width: '100%', maxWidth: '30px',
                height: `${(d.pages / maxPages) * 2.5}rem`,
                background: `linear-gradient(180deg, var(--accent-purple), var(--accent-blue))`,
                borderRadius: '4px 4px 0 0',
                minHeight: d.pages > 0 ? '4px' : '0',
                transition: 'height 0.5s',
              }} />
              <span style={{ fontSize: '0.22rem', color: 'var(--text-soft)' }}>{monthNames[i]}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.28rem', color: 'var(--text-soft)' }}>
          <span>📄 Страницы по месяцам</span>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.15rem 0.35rem', borderRadius: '10px', border: '1px solid var(--border)',
  background: 'var(--bg-soft)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.35rem', transition: 'all 0.2s',
};
const inputStyle: React.CSSProperties = {
  padding: '0.15rem 0.25rem', borderRadius: '8px', border: '1px solid var(--border)',
  background: 'var(--card)', color: 'var(--text)', fontSize: '0.35rem', outline: 'none', width: '100%',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.3rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.05rem',
};
