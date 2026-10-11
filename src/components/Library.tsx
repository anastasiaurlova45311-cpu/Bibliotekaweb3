import { useState } from 'react';
import { useApp } from '../store';
import { Book, BookStatus } from '../types';

const statusLabels: Record<BookStatus, string> = {
  reading: '📖 Читаю',
  want: '💭 Хочу прочитать',
  read: '✅ Прочитано',
  unfinished: '⏸ Не закончено',
};

const statusColors: Record<BookStatus, string> = {
  reading: 'var(--accent-blue)',
  want: 'var(--accent-purple)',
  read: 'var(--accent-green)',
  unfinished: 'var(--text-soft)',
};

export default function Library() {
  const { books, shelves, updateBook, deleteBook, addShelf, deleteShelf } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookStatus | 'all'>('all');
  const [filterShelf, setFilterShelf] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showShelfManager, setShowShelfManager] = useState(false);
  const [newShelfName, setNewShelfName] = useState('');

  const filtered = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchShelf = filterShelf === 'all' || b.shelf === filterShelf;
    return matchSearch && matchStatus && matchShelf;
  });

  if (selectedBook) {
    return <BookDetail book={selectedBook} onBack={() => setSelectedBook(null)} />;
  }

  if (showAddForm) {
    return <AddBookForm onClose={() => setShowAddForm(false)} />;
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.3rem' }}>
        <h2 style={{ fontSize: '0.8rem', color: 'var(--heading)' }}>📚 Моя библиотека</h2>
        <div style={{ display: 'flex', gap: '0.2rem' }}>
          <button onClick={() => setShowShelfManager(!showShelfManager)} style={btnStyle}>🏷️ Полки</button>
          <button onClick={() => setShowAddForm(true)} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>+ Добавить</button>
        </div>
      </div>

      {/* Shelf Manager */}
      {showShelfManager && (
        <div className="animate-slide-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.4rem', marginBottom: '0.4rem', boxShadow: 'var(--shadow)' }}>
          <h4 style={{ fontSize: '0.45rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>Управление полками</h4>
          <div style={{ display: 'flex', gap: '0.2rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
            {shelves.map(s => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', padding: '0.1rem 0.2rem', background: 'var(--bg-soft)', borderRadius: '8px', fontSize: '0.35rem' }}>
                {s}
                <button onClick={() => deleteShelf(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '0.3rem' }}>✕</button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <input value={newShelfName} onChange={e => setNewShelfName(e.target.value)} placeholder="Новая полка..." style={inputStyle} />
            <button onClick={() => { if (newShelfName.trim()) { addShelf(newShelfName.trim()); setNewShelfName(''); } }} style={btnStyle}>+</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по названию, автору, тегам..." style={{ ...inputStyle, flex: 1, minWidth: '200px' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} style={inputStyle}>
          <option value="all">Все статусы</option>
          <option value="reading">📖 Читаю</option>
          <option value="want">💭 Хочу прочитать</option>
          <option value="read">✅ Прочитано</option>
          <option value="unfinished">⏸ Не закончено</option>
        </select>
        <select value={filterShelf} onChange={e => setFilterShelf(e.target.value)} style={inputStyle}>
          <option value="all">Все полки</option>
          {shelves.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Book List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.4rem' }}>
        {filtered.map((book, i) => (
          <div key={book.id} className="animate-slide-up" onClick={() => setSelectedBook(book)} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px',
            padding: '0.5rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: 'var(--shadow)',
            animationDelay: `${i * 0.05}s`, animationFillMode: 'both'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '0.5rem', color: 'var(--heading)', lineHeight: 1.3 }}>{book.title}</h3>
              <span style={{ fontSize: '0.3rem', color: statusColors[book.status], fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                {statusLabels[book.status]}
              </span>
            </div>
            <p style={{ fontSize: '0.38rem', color: 'var(--text-soft)', marginBottom: '0.2rem' }}>{book.author}</p>
            {book.status === 'reading' && (
              <div style={{ marginBottom: '0.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.3rem', color: 'var(--text-soft)', marginBottom: '0.05rem' }}>
                  <span>Прогресс</span>
                  <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-soft)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(book.currentPage / book.totalPages) * 100}%`, background: 'var(--accent-blue)', borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}
            {book.rating && (
              <div style={{ fontSize: '0.35rem', marginBottom: '0.15rem' }}>
                {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.1rem', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.05rem 0.15rem', background: 'var(--bg-soft)', borderRadius: '6px', fontSize: '0.28rem', color: 'var(--text-soft)' }}>📁 {book.shelf}</span>
              {book.tags.slice(0, 3).map(t => (
                <span key={t} style={{ padding: '0.05rem 0.15rem', background: 'var(--bg-soft)', borderRadius: '6px', fontSize: '0.28rem', color: 'var(--text-soft)' }}>#{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-soft)', fontSize: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>📚</span>
          Книги не найдены
        </div>
      )}
    </div>
  );
}

function BookDetail({ book, onBack }: { book: Book; onBack: () => void }) {
  const { updateBook, deleteBook, addJournalEntry, journal } = useApp();
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(book.notes);
  const [newQuote, setNewQuote] = useState('');
  const [reviewText, setReviewText] = useState(book.review || '');
  const [editingReview, setEditingReview] = useState(false);

  const bookEntries = journal.filter(e => e.bookId === book.id);

  const handleStatusChange = (status: BookStatus) => {
    const updates: Partial<Book> = { status };
    if (status === 'reading' && !book.dateStarted) updates.dateStarted = new Date().toISOString().split('T')[0];
    if (status === 'read') { updates.dateFinished = new Date().toISOString().split('T')[0]; updates.currentPage = book.totalPages; }
    updateBook(book.id, updates);
  };

  return (
    <div className="animate-fade-in" style={{ background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', padding: '0.6rem', boxShadow: 'var(--shadow)' }}>
      <button onClick={onBack} style={{ ...btnStyle, marginBottom: '0.3rem' }}>← Назад</button>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ fontSize: '0.7rem', color: 'var(--heading)', marginBottom: '0.1rem' }}>{book.title}</h2>
          <p style={{ fontSize: '0.42rem', color: 'var(--text-soft)', marginBottom: '0.2rem' }}>{book.author}</p>
          {book.isbn && <p style={{ fontSize: '0.32rem', color: 'var(--text-soft)' }}>ISBN: {book.isbn}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.35rem', color: statusColors[book.status], fontWeight: 'bold' }}>{statusLabels[book.status]}</div>
          {book.rating && <div style={{ fontSize: '0.4rem' }}>{'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}</div>}
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: 'var(--bg-soft)', borderRadius: '12px', padding: '0.3rem', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.35rem', marginBottom: '0.1rem' }}>
          <span>Страница {book.currentPage} из {book.totalPages}</span>
          <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
        </div>
        <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
          <input type="range" min={0} max={book.totalPages} value={book.currentPage}
            onChange={e => updateBook(book.id, { currentPage: Number(e.target.value) })}
            className="page-slider" style={{ flex: 1 }} />
          <input type="number" value={book.currentPage} onChange={e => updateBook(book.id, { currentPage: Math.min(Number(e.target.value), book.totalPages) })}
            style={{ ...inputStyle, width: '2rem', textAlign: 'center', fontSize: '0.32rem' }} />
        </div>
      </div>

      {/* Status Buttons */}
      <div style={{ display: 'flex', gap: '0.15rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
        {(Object.keys(statusLabels) as BookStatus[]).map(s => (
          <button key={s} onClick={() => handleStatusChange(s)} style={{
            ...btnStyle, fontSize: '0.32rem',
            background: book.status === s ? statusColors[s] : 'var(--bg-soft)',
            color: book.status === s ? '#fff' : 'var(--text)',
            border: book.status === s ? 'none' : '1px solid var(--border)'
          }}>{statusLabels[s]}</button>
        ))}
      </div>

      {/* Rating */}
      <div style={{ marginBottom: '0.3rem' }}>
        <span style={{ fontSize: '0.35rem', color: 'var(--text-soft)' }}>Оценка: </span>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => updateBook(book.id, { rating: n })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.5rem', color: n <= (book.rating || 0) ? '#f5a623' : 'var(--border)' }}>★</button>
        ))}
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '0.3rem' }}>
        <h4 style={{ fontSize: '0.42rem', color: 'var(--primary)', marginBottom: '0.1rem' }}>📝 Заметки</h4>
        {editingNote ? (
          <div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} style={{ ...inputStyle, width: '100%', minHeight: '2rem', resize: 'vertical' }} />
            <button onClick={() => { updateBook(book.id, { notes: noteText }); setEditingNote(false); }} style={btnStyle}>Сохранить</button>
          </div>
        ) : (
          <div onClick={() => setEditingNote(true)} style={{ fontSize: '0.35rem', color: 'var(--text-soft)', cursor: 'pointer', padding: '0.2rem', background: 'var(--bg-soft)', borderRadius: '8px' }}>
            {book.notes || 'Нажмите, чтобы добавить заметку...'}
          </div>
        )}
      </div>

      {/* Quotes */}
      <div style={{ marginBottom: '0.3rem' }}>
        <h4 style={{ fontSize: '0.42rem', color: 'var(--primary)', marginBottom: '0.1rem' }}>💬 Цитаты</h4>
        {book.quotes.map((q, i) => (
          <div key={i} style={{ fontSize: '0.35rem', padding: '0.15rem 0.2rem', background: 'var(--bg-soft)', borderRadius: '8px', marginBottom: '0.1rem', fontStyle: 'italic' }}>«{q}»</div>
        ))}
        <div style={{ display: 'flex', gap: '0.1rem' }}>
          <input value={newQuote} onChange={e => setNewQuote(e.target.value)} placeholder="Новая цитата..." style={inputStyle} />
          <button onClick={() => { if (newQuote.trim()) { updateBook(book.id, { quotes: [...book.quotes, newQuote.trim()] }); setNewQuote(''); } }} style={btnStyle}>+</button>
        </div>
      </div>

      {/* Review */}
      <div style={{ marginBottom: '0.3rem' }}>
        <h4 style={{ fontSize: '0.42rem', color: 'var(--primary)', marginBottom: '0.1rem' }}>📖 Рецензия</h4>
        {editingReview ? (
          <div>
            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} style={{ ...inputStyle, width: '100%', minHeight: '2rem', resize: 'vertical' }} />
            <button onClick={() => { updateBook(book.id, { review: reviewText }); setEditingReview(false); }} style={btnStyle}>Сохранить</button>
          </div>
        ) : (
          <div onClick={() => setEditingReview(true)} style={{ fontSize: '0.35rem', color: 'var(--text-soft)', cursor: 'pointer', padding: '0.2rem', background: 'var(--bg-soft)', borderRadius: '8px' }}>
            {book.review || 'Нажмите, чтобы написать рецензию...'}
          </div>
        )}
      </div>

      {/* Reading Log */}
      {bookEntries.length > 0 && (
        <div style={{ marginBottom: '0.3rem' }}>
          <h4 style={{ fontSize: '0.42rem', color: 'var(--primary)', marginBottom: '0.1rem' }}>📊 История чтения</h4>
          {bookEntries.slice(-5).map(e => (
            <div key={e.id} style={{ fontSize: '0.32rem', padding: '0.1rem 0.2rem', background: 'var(--bg-soft)', borderRadius: '6px', marginBottom: '0.05rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>{e.date}</span>
              <span>{e.pagesRead} стр. / {e.minutesRead} мин.</span>
            </div>
          ))}
        </div>
      )}

      {/* Delete */}
      <button onClick={() => { if (confirm('Удалить книгу?')) { deleteBook(book.id); onBack(); } }} style={{ ...btnStyle, color: 'var(--danger)', marginTop: '0.2rem' }}>🗑️ Удалить книгу</button>
    </div>
  );
}

function AddBookForm({ onClose }: { onClose: () => void }) {
  const { addBook, shelves, series, addSeries } = useApp();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [totalPages, setTotalPages] = useState(300);
  const [shelf, setShelf] = useState(shelves[0] || '');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<BookStatus>('want');
  const [seriesName, setSeriesName] = useState('');
  const [seriesIndex, setSeriesIndex] = useState(1);
  const [searchMode, setSearchMode] = useState<'manual' | 'isbn'>('manual');

  const handleAdd = () => {
    if (!title.trim() || !author.trim()) return;
    const newBook: Book = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || undefined,
      totalPages,
      currentPage: status === 'read' ? totalPages : 0,
      status,
      shelf,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      dateAdded: new Date().toISOString().split('T')[0],
      notes: '',
      quotes: [],
      seriesId: seriesName ? `s_${Date.now()}` : undefined,
      seriesIndex: seriesName ? seriesIndex : undefined,
    };
    addBook(newBook);
    if (seriesName.trim()) {
      const existingSeries = series.find(s => s.name === seriesName.trim());
      if (!existingSeries) {
        addSeries({ id: newBook.seriesId!, name: seriesName.trim(), author: author.trim(), status: 'active', totalBooks: 1 });
      }
    }
    onClose();
  };

  return (
    <div className="animate-fade-in" style={{ background: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)', padding: '0.6rem', boxShadow: 'var(--shadow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <h2 style={{ fontSize: '0.7rem', color: 'var(--heading)' }}>📕 Добавить книгу</h2>
        <button onClick={onClose} style={btnStyle}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.3rem' }}>
        <button onClick={() => setSearchMode('manual')} style={{ ...btnStyle, background: searchMode === 'manual' ? 'var(--primary)' : 'var(--bg-soft)', color: searchMode === 'manual' ? '#fff' : 'var(--text)' }}>Вручную</button>
        <button onClick={() => setSearchMode('isbn')} style={{ ...btnStyle, background: searchMode === 'isbn' ? 'var(--primary)' : 'var(--bg-soft)', color: searchMode === 'isbn' ? '#fff' : 'var(--text)' }}>По ISBN</button>
      </div>

      {searchMode === 'isbn' && (
        <div style={{ marginBottom: '0.3rem' }}>
          <input value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="Введите ISBN или отсканируйте..." style={{ ...inputStyle, width: '100%' }} />
          <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)', marginTop: '0.1rem' }}>📷 Камера для сканирования ISBN (демо)</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.2rem' }}>
        <div>
          <label style={labelStyle}>Название *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Автор *</label>
          <input value={author} onChange={e => setAuthor(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Всего страниц</label>
          <input type="number" value={totalPages} onChange={e => setTotalPages(Number(e.target.value))} style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Полка</label>
          <select value={shelf} onChange={e => setShelf(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
            {shelves.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Статус</label>
          <select value={status} onChange={e => setStatus(e.target.value as BookStatus)} style={{ ...inputStyle, width: '100%' }}>
            <option value="want">💭 Хочу прочитать</option>
            <option value="reading">📖 Читаю</option>
            <option value="read">✅ Прочитано</option>
            <option value="unfinished">⏸ Не закончено</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Теги (через запятую)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="роман, фантастика..." style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <label style={labelStyle}>Серия (необязательно)</label>
          <input value={seriesName} onChange={e => setSeriesName(e.target.value)} placeholder="Название серии..." style={{ ...inputStyle, width: '100%' }} />
        </div>
        {seriesName && (
          <div>
            <label style={labelStyle}>Номер в серии</label>
            <input type="number" value={seriesIndex} onChange={e => setSeriesIndex(Number(e.target.value))} min={1} style={{ ...inputStyle, width: '100%' }} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.4rem' }}>
        <button onClick={handleAdd} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff', padding: '0.25rem 0.6rem' }}>✓ Добавить книгу</button>
        <button onClick={onClose} style={btnStyle}>Отмена</button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.15rem 0.35rem', borderRadius: '10px', border: '1px solid var(--border)',
  background: 'var(--bg-soft)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.35rem',
  transition: 'all 0.2s',
};

const inputStyle: React.CSSProperties = {
  padding: '0.15rem 0.25rem', borderRadius: '8px', border: '1px solid var(--border)',
  background: 'var(--card)', color: 'var(--text)', fontSize: '0.35rem', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.32rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.05rem',
};
