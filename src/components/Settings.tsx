import { useState, useRef } from 'react';
import { useApp } from '../store';
import { Book } from '../types';

export default function Settings() {
  const { darkMode, setDarkMode, ambientSound, setAmbientSound, soundVolume, setSoundVolume, exportCSV, importBooks, isGuest, setGuest, books } = useApp();
  const [importData, setImportData] = useState('');
  const [importSource, setImportSource] = useState<'goodreads' | 'storygraph' | 'librarything' | 'csv'>('csv');
  const [showImport, setShowImport] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sounds = [
    { id: 'none', label: '🔇 Без звука', emoji: '' },
    { id: 'rain', label: '🌧️ Дождь', emoji: '🌧️' },
    { id: 'fireplace', label: '🔥 Камин', emoji: '🔥' },
    { id: 'forest', label: '🌲 Лес', emoji: '🌲' },
    { id: 'cafe', label: '☕ Кафе', emoji: '☕' },
    { id: 'ocean', label: '🌊 Океан', emoji: '🌊' },
    { id: 'library', label: '📚 Библиотека', emoji: '📚' },
  ];

  const handleExport = () => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `my-library-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportData(text);
    };
    reader.readAsText(file);
  };

  const processImport = () => {
    if (!importData.trim()) return;
    try {
      if (importSource === 'csv') {
        const lines = importData.split('\n').filter(l => l.trim());
        if (lines.length < 2) { setImportStatus('❌ Файл пустой'); return; }
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const newBooks: Book[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          if (values.length >= 2) {
            newBooks.push({
              id: `imp_${Date.now()}_${i}`,
              title: values[headers.indexOf('Title')] || values[0] || `Книга ${i}`,
              author: values[headers.indexOf('Author')] || values[1] || 'Неизвестный',
              isbn: values[headers.indexOf('ISBN')] || undefined,
              totalPages: parseInt(values[headers.indexOf('Total Pages')] || values[3]) || 200,
              currentPage: parseInt(values[headers.indexOf('Current Page')] || values[4]) || 0,
              status: (values[headers.indexOf('Status')] || values[5] || 'want') as any,
              rating: parseInt(values[headers.indexOf('Rating')] || values[6]) || undefined,
              shelf: values[headers.indexOf('Shelf')] || values[7] || 'Импортированные',
              tags: (values[headers.indexOf('Tags')] || values[8] || '').split(';').filter(Boolean),
              dateAdded: values[headers.indexOf('Date Added')] || values[9] || new Date().toISOString().split('T')[0],
              notes: values[headers.indexOf('Notes')] || values[12] || '',
              quotes: [],
              review: values[headers.indexOf('Review')] || values[13] || '',
            });
          }
        }
        importBooks(newBooks);
        setImportStatus(`✅ Импортировано ${newBooks.length} книг`);
      } else if (importSource === 'goodreads') {
        // Simulate Goodreads import
        const lines = importData.split('\n').filter(l => l.trim());
        const newBooks: Book[] = lines.slice(1).map((line, i) => {
          const parts = line.split(',');
          return {
            id: `gr_${Date.now()}_${i}`,
            title: (parts[1] || `Goodreads Book ${i}`).replace(/"/g, ''),
            author: (parts[2] || 'Unknown').replace(/"/g, ''),
            totalPages: parseInt(parts[4] || parts[3]) || 200,
            currentPage: 0,
            status: 'want' as const,
            shelf: 'Goodreads Import',
            tags: ['imported', 'goodreads'],
            dateAdded: new Date().toISOString().split('T')[0],
            notes: '', quotes: [],
          };
        });
        importBooks(newBooks);
        setImportStatus(`✅ Импортировано ${newBooks.length} книг из Goodreads`);
      } else {
        // Generic import for StoryGraph/LibraryThing
        const lines = importData.split('\n').filter(l => l.trim());
        const newBooks: Book[] = lines.slice(1).map((line, i) => {
          const parts = line.split(',');
          return {
            id: `${importSource}_${Date.now()}_${i}`,
            title: (parts[0] || `Book ${i}`).replace(/"/g, ''),
            author: (parts[1] || 'Unknown').replace(/"/g, ''),
            totalPages: parseInt(parts[2]) || 200,
            currentPage: 0,
            status: 'want' as const,
            shelf: `${importSource} Import`,
            tags: ['imported', importSource],
            dateAdded: new Date().toISOString().split('T')[0],
            notes: '', quotes: [],
          };
        });
        importBooks(newBooks);
        setImportStatus(`✅ Импортировано ${newBooks.length} книг из ${importSource}`);
      }
    } catch (err) {
      setImportStatus('❌ Ошибка при импорте. Проверьте формат файла.');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ fontSize: '0.8rem', color: 'var(--heading)', marginBottom: '0.5rem' }}>⚙️ Настройки</h2>

      {/* Account */}
      <Section title="👤 Аккаунт">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.35rem', color: 'var(--text-soft)' }}>
            {isGuest ? '👤 Гостевой режим' : '🔐 Зарегистрированный пользователь'}
          </span>
          <button onClick={() => setGuest(!isGuest)} style={btnStyle}>
            {isGuest ? 'Войти' : 'Гостевой режим'}
          </button>
        </div>
        {isGuest && (
          <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginTop: '0.1rem' }}>
            💡 В гостевом режиме данные хранятся локально в браузере.
          </p>
        )}
      </Section>

      {/* Theme */}
      <Section title="🎨 Оформление">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ fontSize: '0.35rem' }}>{darkMode ? '🌙 Тёмная тема' : '☀️ Светлая тема'}</span>
          <button onClick={() => setDarkMode(!darkMode)} style={{
            ...btnStyle, background: darkMode ? 'var(--accent-purple)' : 'var(--bg-soft)',
            color: darkMode ? '#fff' : 'var(--text)'
          }}>
            {darkMode ? '☀️ Светлая' : '🌙 Тёмная'}
          </button>
        </div>
      </Section>

      {/* Ambient Sounds */}
      <Section title="🎵 Фоновые звуки">
        <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginBottom: '0.2rem' }}>
          Создайте атмосферу для чтения
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.15rem' }}>
          {sounds.map(s => (
            <button key={s.id} onClick={() => setAmbientSound(s.id)} style={{
              ...btnStyle,
              background: ambientSound === s.id ? 'var(--accent-blue)' : 'var(--bg-soft)',
              color: ambientSound === s.id ? '#fff' : 'var(--text)',
              textAlign: 'center',
              padding: '0.2rem',
            }}>
              {s.label}
            </button>
          ))}
        </div>
        {ambientSound !== 'none' && (
          <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.3rem' }}>🔊</span>
            <input type="range" min={0} max={100} value={soundVolume * 100}
              onChange={e => setSoundVolume(Number(e.target.value) / 100)}
              className="page-slider" style={{ flex: 1 }} />
            <span style={{ fontSize: '0.3rem' }}>{Math.round(soundVolume * 100)}%</span>
          </div>
        )}
        {ambientSound !== 'none' && <SoundVisualizer sound={ambientSound} />}
      </Section>

      {/* Export */}
      <Section title="💾 Экспорт">
        <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginBottom: '0.2rem' }}>
          Экспортируйте библиотеку, журнал и заметки в CSV
        </p>
        <button onClick={handleExport} style={{ ...btnStyle, background: 'var(--accent-green)', color: '#fff' }}>
          📥 Скачать CSV ({books.length} книг)
        </button>
      </Section>

      {/* Import */}
      <Section title="📤 Импорт">
        <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginBottom: '0.2rem' }}>
          Импортируйте библиотеку из Goodreads, StoryGraph или LibraryThing
        </p>
        <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
          {[
            { id: 'goodreads' as const, label: 'Goodreads' },
            { id: 'storygraph' as const, label: 'StoryGraph' },
            { id: 'librarything' as const, label: 'LibraryThing' },
            { id: 'csv' as const, label: 'CSV файл' },
          ].map(src => (
            <button key={src.id} onClick={() => setImportSource(src.id)} style={{
              ...btnStyle,
              background: importSource === src.id ? 'var(--primary)' : 'var(--bg-soft)',
              color: importSource === src.id ? '#fff' : 'var(--text)',
            }}>{src.label}</button>
          ))}
        </div>
        <button onClick={() => setShowImport(!showImport)} style={btnStyle}>
          {showImport ? 'Скрыть' : 'Выбрать файл'}
        </button>
        {showImport && (
          <div className="animate-slide-up" style={{ marginTop: '0.2rem' }}>
            <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleFileImport} style={{ fontSize: '0.3rem', marginBottom: '0.1rem' }} />
            <textarea value={importData} onChange={e => setImportData(e.target.value)} placeholder="Или вставьте данные сюда..." style={{ ...inputStyle, width: '100%', minHeight: '2rem', resize: 'vertical' }} />
            <button onClick={processImport} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff', marginTop: '0.1rem' }}>📤 Импортировать</button>
          </div>
        )}
        {importStatus && (
          <p style={{ fontSize: '0.32rem', marginTop: '0.1rem', color: importStatus.startsWith('✅') ? 'var(--accent-green)' : 'var(--danger)' }}>
            {importStatus}
          </p>
        )}
      </Section>

      {/* Feedback */}
      <Section title="💬 Обратная связь">
        <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginBottom: '0.2rem', lineHeight: 1.5 }}>
          Ваше мнение важно для нас! Поделитесь впечатлениями, предложите улучшения или сообщите о проблеме.
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSckpu_7VtQoME0QDDo5NtKFi2NwK4YiXDbwxts42tIwUN0iuA/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            background: 'var(--accent-blue)',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.38rem',
            transition: 'all 0.3s',
            boxShadow: 'var(--shadow)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
        >
          📝 Заполнить форму
        </a>
      </Section>

      {/* About */}
      <Section title="ℹ️ О приложении">
        <p style={{ fontSize: '0.32rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--heading)' }}>Моя библиотека</strong> — ваш персональный помощник для учёта книг, отслеживания прогресса чтения и организации книжных клубов.
        </p>
        <p style={{ fontSize: '0.28rem', color: 'var(--text-soft)', marginTop: '0.1rem' }}>
          Версия 1.0 • Данные хранятся локально
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px',
      padding: '0.4rem', marginBottom: '0.3rem', boxShadow: 'var(--shadow)'
    }}>
      <h3 style={{ fontSize: '0.48rem', color: 'var(--heading)', marginBottom: '0.2rem' }}>{title}</h3>
      {children}
    </div>
  );
}

function SoundVisualizer({ sound }: { sound: string }) {
  const emojis: Record<string, string[]> = {
    rain: ['💧', '🌧️', '☔', '💦'],
    fireplace: ['🔥', '✨', '🪵', '💫'],
    forest: ['🌲', '🍃', '🌿', '🦜'],
    cafe: ['☕', '🫖', '🥐', '🎵'],
    ocean: ['🌊', '🐚', '🏖️', '🐠'],
    library: ['📚', '📖', '🕯️', '✨'],
  };
  const items = emojis[sound] || ['🎵'];
  
  return (
    <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem', justifyContent: 'center' }}>
      {items.map((emoji, i) => (
        <span key={i} style={{
          fontSize: '0.6rem',
          animation: `fadeIn 1s ease ${i * 0.3}s infinite alternate`,
          opacity: 0.7,
        }}>{emoji}</span>
      ))}
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
