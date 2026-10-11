import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Book, Series, Goal, JournalEntry, BookClub, ReadingStats, ClubPost, ClubComment, Poll } from './types';

interface AppState {
  books: Book[];
  series: Series[];
  goals: Goal[];
  journal: JournalEntry[];
  clubs: BookClub[];
  shelves: string[];
  isGuest: boolean;
  darkMode: boolean;
  ambientSound: string;
  soundVolume: number;
}

interface AppContextType extends AppState {
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addSeries: (series: Series) => void;
  updateSeries: (id: string, updates: Partial<Series>) => void;
  addGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  addShelf: (name: string) => void;
  deleteShelf: (name: string) => void;
  addClub: (club: BookClub) => void;
  addClubPost: (clubId: string, post: ClubPost) => void;
  addClubComment: (clubId: string, postId: string, comment: ClubComment) => void;
  addPoll: (clubId: string, poll: Poll) => void;
  votePoll: (clubId: string, pollId: string, optionIndex: number) => void;
  setDarkMode: (v: boolean) => void;
  setAmbientSound: (s: string) => void;
  setSoundVolume: (v: number) => void;
  setGuest: (v: boolean) => void;
  importBooks: (books: Book[]) => void;
  exportCSV: () => string;
  getStats: () => ReadingStats;
}

const defaultBooks: Book[] = [
  {
    id: '1', title: 'Мастер и Маргарита', author: 'Михаил Булгаков',
    totalPages: 480, currentPage: 480, status: 'read', rating: 5,
    shelf: 'Классика', tags: ['роман', 'фантастика', 'классика'],
    seriesId: undefined, dateAdded: '2024-01-15', dateStarted: '2024-01-10',
    dateFinished: '2024-01-25', notes: 'Шедевр!', quotes: ['Рукописи не горят'],
    review: 'Невероятная книга, сочетающая сатиру, мистику и философию.'
  },
  {
    id: '2', title: 'Властелин колец: Братство Кольца', author: 'Дж. Р. Р. Толкин',
    totalPages: 480, currentPage: 320, status: 'reading',
    shelf: 'Фэнтези', tags: ['фэнтези', 'приключения'],
    seriesId: 's1', seriesIndex: 1, dateAdded: '2024-02-01', dateStarted: '2024-02-05',
    notes: '', quotes: []
  },
  {
    id: '3', title: 'Властелин колец: Две крепости', author: 'Дж. Р. Р. Толкин',
    totalPages: 352, currentPage: 0, status: 'want',
    shelf: 'Фэнтези', tags: ['фэнтези', 'приключения'],
    seriesId: 's1', seriesIndex: 2, dateAdded: '2024-02-01',
    notes: '', quotes: []
  },
  {
    id: '4', title: 'Властелин колец: Возвращение короля', author: 'Дж. Р. Р. Толкин',
    totalPages: 416, currentPage: 0, status: 'want',
    shelf: 'Фэнтези', tags: ['фэнтези', 'приключения'],
    seriesId: 's1', seriesIndex: 3, dateAdded: '2024-02-01',
    notes: '', quotes: []
  },
  {
    id: '5', title: '1984', author: 'Джордж Оруэлл',
    totalPages: 328, currentPage: 328, status: 'read', rating: 5,
    shelf: 'Антиутопия', tags: ['антиутопия', 'классика'],
    dateAdded: '2024-03-01', dateStarted: '2024-03-05', dateFinished: '2024-03-12',
    notes: 'Пугающе актуально', quotes: ['Большой Брат следит за тобой'],
    review: 'Пророческий роман, который не теряет актуальности.'
  },
  {
    id: '6', title: 'Дюна', author: 'Фрэнк Герберт',
    totalPages: 688, currentPage: 200, status: 'reading',
    shelf: 'Научная фантастика', tags: ['фантастика', 'эпос'],
    seriesId: 's2', seriesIndex: 1, dateAdded: '2024-03-15', dateStarted: '2024-03-20',
    notes: 'Потрясающий мир', quotes: ['Страх — убийца разума']
  },
  {
    id: '7', title: 'Дюна: Мессия', author: 'Фрэнк Герберт',
    totalPages: 320, currentPage: 0, status: 'want',
    shelf: 'Научная фантастика', tags: ['фантастика', 'эпос'],
    seriesId: 's2', seriesIndex: 2, dateAdded: '2024-03-15',
    notes: '', quotes: []
  },
  {
    id: '8', title: 'Анна Каренина', author: 'Лев Толстой',
    totalPages: 864, currentPage: 150, status: 'unfinished',
    shelf: 'Классика', tags: ['роман', 'классика'],
    dateAdded: '2024-01-20', dateStarted: '2024-01-22',
    notes: 'Вернусь позже', quotes: []
  },
];

const defaultSeries: Series[] = [
  { id: 's1', name: 'Властелин Колец', author: 'Дж. Р. Р. Толкин', status: 'active', totalBooks: 3 },
  { id: 's2', name: 'Хроники Дюны', author: 'Фрэнк Герберт', status: 'active', totalBooks: 6 },
];

const defaultGoals: Goal[] = [
  { id: 'g1', type: 'books', target: 24, period: 'year', year: 2024 },
  { id: 'g2', type: 'pages', target: 5000, period: 'year', year: 2024 },
];

const defaultJournal: JournalEntry[] = [
  { id: 'j1', bookId: '1', date: '2024-01-10', minutesRead: 45, pagesRead: 30 },
  { id: 'j2', bookId: '1', date: '2024-01-11', minutesRead: 60, pagesRead: 40 },
  { id: 'j3', bookId: '2', date: '2024-02-05', minutesRead: 30, pagesRead: 25 },
  { id: 'j4', bookId: '5', date: '2024-03-05', minutesRead: 50, pagesRead: 35 },
  { id: 'j5', bookId: '6', date: '2024-03-20', minutesRead: 40, pagesRead: 30 },
];

const defaultClubs: BookClub[] = [
  {
    id: 'c1', name: 'Любители фантастики', description: 'Обсуждаем лучшие произведения жанра',
    members: ['Вы', 'Алексей', 'Мария', 'Дмитрий'],
    currentBook: 'Дюна',
    posts: [
      { id: 'p1', clubId: 'c1', author: 'Мария', date: '2024-03-22', content: 'Только начала читать Дюну — мир просто потрясающий! Как вам экосистема Арракиса?', likes: 3, comments: [
        { id: 'cm1', author: 'Алексей', date: '2024-03-22', content: 'Герберт — мастер миростроения. Каждая деталь продумана!' }
      ]},
    ],
    polls: [
      { id: 'pl1', question: 'Какую книгу читаем следующей?', options: [
        { text: 'Дюна: Мессия', votes: 3 },
        { text: 'Гиперион', votes: 2 },
        { text: 'Левая рука тьмы', votes: 1 },
      ]}
    ]
  }
];

const AppContext = createContext<AppContextType | null>(null);

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => loadState('lib_books', defaultBooks));
  const [series, setSeries] = useState<Series[]>(() => loadState('lib_series', defaultSeries));
  const [goals, setGoals] = useState<Goal[]>(() => loadState('lib_goals', defaultGoals));
  const [journal, setJournal] = useState<JournalEntry[]>(() => loadState('lib_journal', defaultJournal));
  const [clubs, setClubs] = useState<BookClub[]>(() => loadState('lib_clubs', defaultClubs));
  const [shelves, setShelves] = useState<string[]>(() => loadState('lib_shelves', ['Классика', 'Фэнтези', 'Научная фантастика', 'Антиутопия']));
  const [isGuest, setIsGuest] = useState(() => loadState('lib_guest', false));
  const [darkMode, setDarkMode] = useState(() => loadState('lib_dark', false));
  const [ambientSound, setAmbientSound] = useState(() => loadState('lib_sound', 'none'));
  const [soundVolume, setSoundVolume] = useState(() => loadState('lib_volume', 0.5));

  useEffect(() => { localStorage.setItem('lib_books', JSON.stringify(books)); }, [books]);
  useEffect(() => { localStorage.setItem('lib_series', JSON.stringify(series)); }, [series]);
  useEffect(() => { localStorage.setItem('lib_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('lib_journal', JSON.stringify(journal)); }, [journal]);
  useEffect(() => { localStorage.setItem('lib_clubs', JSON.stringify(clubs)); }, [clubs]);
  useEffect(() => { localStorage.setItem('lib_shelves', JSON.stringify(shelves)); }, [shelves]);
  useEffect(() => { localStorage.setItem('lib_guest', JSON.stringify(isGuest)); }, [isGuest]);
  useEffect(() => { localStorage.setItem('lib_dark', JSON.stringify(darkMode)); }, [darkMode]);
  useEffect(() => { localStorage.setItem('lib_sound', JSON.stringify(ambientSound)); }, [ambientSound]);
  useEffect(() => { localStorage.setItem('lib_volume', JSON.stringify(soundVolume)); }, [soundVolume]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addBook = useCallback((book: Book) => setBooks(p => [...p, book]), []);
  const updateBook = useCallback((id: string, updates: Partial<Book>) => setBooks(p => p.map(b => b.id === id ? { ...b, ...updates } : b)), []);
  const deleteBook = useCallback((id: string) => setBooks(p => p.filter(b => b.id !== id)), []);
  const addSeries = useCallback((s: Series) => setSeries(p => [...p, s]), []);
  const updateSeries = useCallback((id: string, updates: Partial<Series>) => setSeries(p => p.map(s => s.id === id ? { ...s, ...updates } : s)), []);
  const addGoal = useCallback((g: Goal) => setGoals(p => [...p, g]), []);
  const deleteGoal = useCallback((id: string) => setGoals(p => p.filter(g => g.id !== id)), []);
  const addJournalEntry = useCallback((e: JournalEntry) => setJournal(p => [...p, e]), []);
  const addShelf = useCallback((name: string) => setShelves(p => [...new Set([...p, name])]), []);
  const deleteShelf = useCallback((name: string) => setShelves(p => p.filter(s => s !== name)), []);
  const addClub = useCallback((c: BookClub) => setClubs(p => [...p, c]), []);
  const addClubPost = useCallback((clubId: string, post: ClubPost) => setClubs(p => p.map(c => c.id === clubId ? { ...c, posts: [post, ...c.posts] } : c)), []);
  const addClubComment = useCallback((clubId: string, postId: string, comment: ClubComment) => setClubs(p => p.map(c => c.id === clubId ? { ...c, posts: c.posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p) } : c)), []);
  const addPoll = useCallback((clubId: string, poll: Poll) => setClubs(p => p.map(c => c.id === clubId ? { ...c, polls: [...c.polls, poll] } : c)), []);
  const votePoll = useCallback((clubId: string, pollId: string, optionIndex: number) => setClubs(p => p.map(c => c.id === clubId ? { ...c, polls: c.polls.map(pl => pl.id === pollId ? { ...pl, options: pl.options.map((o, i) => i === optionIndex ? { ...o, votes: o.votes + 1 } : o) } : pl) } : c)), []);
  const importBooks = useCallback((newBooks: Book[]) => setBooks(p => [...p, ...newBooks]), []);

  const exportCSV = useCallback(() => {
    const headers = ['Title', 'Author', 'ISBN', 'Total Pages', 'Current Page', 'Status', 'Rating', 'Shelf', 'Tags', 'Date Added', 'Date Started', 'Date Finished', 'Notes', 'Review'];
    const rows = books.map(b => [
      b.title, b.author, b.isbn || '', b.totalPages, b.currentPage, b.status, b.rating || '', b.shelf, b.tags.join(';'), b.dateAdded, b.dateStarted || '', b.dateFinished || '', b.notes, b.review || ''
    ]);
    return [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  }, [books]);

  const getStats = useCallback((): ReadingStats => {
    const now = new Date();
    const thisYear = now.getFullYear();
    const readBooks = books.filter(b => b.status === 'read');
    const thisYearBooks = readBooks.filter(b => b.dateFinished && new Date(b.dateFinished).getFullYear() === thisYear);
    const totalPagesRead = journal.reduce((s, e) => s + e.pagesRead, 0);
    const totalMinutesRead = journal.reduce((s, e) => s + e.minutesRead, 0);
    const thisYearJournal = journal.filter(e => new Date(e.date).getFullYear() === thisYear);
    const pagesThisYear = thisYearJournal.reduce((s, e) => s + e.pagesRead, 0);
    const minutesThisYear = thisYearJournal.reduce((s, e) => s + e.minutesRead, 0);
    const uniqueAuthors = [...new Set(readBooks.map(b => b.author))];
    
    // Calculate streak
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

    return {
      totalPagesRead,
      totalBooksRead: readBooks.length,
      totalMinutesRead,
      booksThisYear: thisYearBooks.length,
      pagesThisYear,
      minutesThisYear,
      uniqueAuthors,
      streak
    };
  }, [books, journal]);

  return (
    <AppContext.Provider value={{
      books, series, goals, journal, clubs, shelves, isGuest, darkMode, ambientSound, soundVolume,
      addBook, updateBook, deleteBook, addSeries, updateSeries, addGoal, deleteGoal,
      addJournalEntry, addShelf, deleteShelf, addClub, addClubPost, addClubComment,
      addPoll, votePoll, setDarkMode, setAmbientSound, setSoundVolume, setGuest: setIsGuest,
      importBooks, exportCSV, getStats
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
