export type BookStatus = 'reading' | 'want' | 'read' | 'unfinished';
export type SeriesStatus = 'active' | 'paused' | 'abandoned';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  cover?: string;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  rating?: number;
  shelf: string;
  tags: string[];
  seriesId?: string;
  seriesIndex?: number;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
  notes: string;
  quotes: string[];
  review?: string;
}

export interface Series {
  id: string;
  name: string;
  author: string;
  status: SeriesStatus;
  totalBooks: number;
}

export interface Goal {
  id: string;
  type: 'books' | 'pages' | 'minutes' | 'authors';
  target: number;
  period: 'year' | 'month' | 'week' | 'custom';
  year: number;
  month?: number;
}

export interface JournalEntry {
  id: string;
  bookId: string;
  date: string;
  minutesRead: number;
  pagesRead: number;
  note?: string;
}

export interface ClubPost {
  id: string;
  clubId: string;
  author: string;
  date: string;
  content: string;
  likes: number;
  comments: ClubComment[];
}

export interface ClubComment {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface BookClub {
  id: string;
  name: string;
  description: string;
  members: string[];
  currentBook?: string;
  posts: ClubPost[];
  polls: Poll[];
}

export interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
}

export interface ReadingStats {
  totalPagesRead: number;
  totalBooksRead: number;
  totalMinutesRead: number;
  booksThisYear: number;
  pagesThisYear: number;
  minutesThisYear: number;
  uniqueAuthors: string[];
  streak: number;
}
