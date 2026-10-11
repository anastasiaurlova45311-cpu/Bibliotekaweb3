import { useState } from 'react';
import { useApp } from '../store';
import { BookClub } from '../types';

export default function BookClubs() {
  const { clubs, addClub, addClubPost, addClubComment, addPoll, votePoll } = useApp();
  const [selectedClub, setSelectedClub] = useState<BookClub | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubDesc, setClubDesc] = useState('');
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [showPollForm, setShowPollForm] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '', '']);

  const handleCreateClub = () => {
    if (!clubName.trim()) return;
    addClub({
      id: Date.now().toString(),
      name: clubName.trim(),
      description: clubDesc.trim(),
      members: ['Вы'],
      posts: [],
      polls: [],
    });
    setShowCreate(false);
    setClubName('');
    setClubDesc('');
  };

  const handlePost = () => {
    if (!selectedClub || !newPost.trim()) return;
    addClubPost(selectedClub.id, {
      id: Date.now().toString(),
      clubId: selectedClub.id,
      author: 'Вы',
      date: new Date().toISOString().split('T')[0],
      content: newPost.trim(),
      likes: 0,
      comments: [],
    });
    setNewPost('');
    setSelectedClub({ ...selectedClub, posts: [{ id: Date.now().toString(), clubId: selectedClub.id, author: 'Вы', date: new Date().toISOString().split('T')[0], content: newPost.trim(), likes: 0, comments: [] }, ...selectedClub.posts] });
  };

  const handleComment = (postId: string) => {
    if (!selectedClub || !newComment[postId]?.trim()) return;
    addClubComment(selectedClub.id, postId, {
      id: Date.now().toString(),
      author: 'Вы',
      date: new Date().toISOString().split('T')[0],
      content: newComment[postId].trim(),
    });
    setNewComment({ ...newComment, [postId]: '' });
  };

  const handleAddPoll = () => {
    if (!selectedClub || !pollQuestion.trim()) return;
    const validOptions = pollOptions.filter(o => o.trim());
    if (validOptions.length < 2) return;
    addPoll(selectedClub.id, {
      id: Date.now().toString(),
      question: pollQuestion.trim(),
      options: validOptions.map(text => ({ text: text.trim(), votes: 0 })),
    });
    setShowPollForm(false);
    setPollQuestion('');
    setPollOptions(['', '', '']);
  };

  if (selectedClub) {
    const club = clubs.find(c => c.id === selectedClub.id) || selectedClub;
    return (
      <div className="animate-fade-in">
        <button onClick={() => setSelectedClub(null)} style={{ ...btnStyle, marginBottom: '0.3rem' }}>← Назад к клубам</button>
        
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '0.5rem', marginBottom: '0.4rem', boxShadow: 'var(--shadow)' }}>
          <h2 style={{ fontSize: '0.7rem', color: 'var(--heading)', marginBottom: '0.1rem' }}>📖 {club.name}</h2>
          <p style={{ fontSize: '0.35rem', color: 'var(--text-soft)', marginBottom: '0.2rem' }}>{club.description}</p>
          <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.3rem', color: 'var(--text-soft)' }}>
            <span>👥 {club.members.length} участников</span>
            {club.currentBook && <span>📚 Текущая книга: {club.currentBook}</span>}
          </div>
          <div style={{ display: 'flex', gap: '0.1rem', flexWrap: 'wrap', marginTop: '0.1rem' }}>
            {club.members.map(m => (
              <span key={m} style={{ padding: '0.05rem 0.15rem', background: 'var(--bg-soft)', borderRadius: '8px', fontSize: '0.28rem' }}>{m}</span>
            ))}
          </div>
        </div>

        {/* New Post */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.3rem', marginBottom: '0.3rem', boxShadow: 'var(--shadow)' }}>
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Поделитесь мыслями о книге..." style={{ ...inputStyle, width: '100%', minHeight: '1.5rem', resize: 'vertical', marginBottom: '0.1rem' }} />
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <button onClick={handlePost} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>📝 Опубликовать</button>
            <button onClick={() => setShowPollForm(!showPollForm)} style={btnStyle}>📊 Опрос</button>
          </div>
        </div>

        {/* Poll Form */}
        {showPollForm && (
          <div className="animate-slide-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.3rem', marginBottom: '0.3rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontSize: '0.4rem', color: 'var(--primary)', marginBottom: '0.1rem' }}>Новый опрос</h4>
            <input value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="Вопрос..." style={{ ...inputStyle, width: '100%', marginBottom: '0.1rem' }} />
            {pollOptions.map((opt, i) => (
              <input key={i} value={opt} onChange={e => { const opts = [...pollOptions]; opts[i] = e.target.value; setPollOptions(opts); }} placeholder={`Вариант ${i + 1}`} style={{ ...inputStyle, width: '100%', marginBottom: '0.05rem' }} />
            ))}
            <button onClick={() => setPollOptions([...pollOptions, ''])} style={{ ...btnStyle, fontSize: '0.3rem', marginBottom: '0.1rem' }}>+ Вариант</button>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              <button onClick={handleAddPoll} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>✓ Создать</button>
              <button onClick={() => setShowPollForm(false)} style={btnStyle}>Отмена</button>
            </div>
          </div>
        )}

        {/* Polls */}
        {club.polls.map(poll => (
          <div key={poll.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.3rem', marginBottom: '0.2rem', boxShadow: 'var(--shadow)' }}>
            <h4 style={{ fontSize: '0.4rem', color: 'var(--heading)', marginBottom: '0.15rem' }}>📊 {poll.question}</h4>
            {poll.options.map((opt, i) => {
              const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0);
              const pct = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
              return (
                <div key={i} style={{ marginBottom: '0.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.3rem', marginBottom: '0.02rem' }}>
                    <span>{opt.text}</span>
                    <span style={{ color: 'var(--text-soft)' }}>{opt.votes} ({Math.round(pct)}%)</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-soft)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-purple)', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                  <button onClick={() => votePoll(club.id, poll.id, i)} style={{ ...btnStyle, fontSize: '0.25rem', marginTop: '0.02rem' }}>Голосовать</button>
                </div>
              );
            })}
          </div>
        ))}

        {/* Posts */}
        {club.posts.map(post => (
          <div key={post.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.3rem', marginBottom: '0.2rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
              <span style={{ fontSize: '0.35rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>{post.author}</span>
              <span style={{ fontSize: '0.28rem', color: 'var(--text-soft)' }}>{post.date}</span>
            </div>
            <p style={{ fontSize: '0.35rem', lineHeight: 1.4, marginBottom: '0.15rem' }}>{post.content}</p>
            <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.28rem', color: 'var(--text-soft)' }}>
              <span>❤️ {post.likes}</span>
              <span>💬 {post.comments.length}</span>
            </div>
            
            {/* Comments */}
            {post.comments.map(c => (
              <div key={c.id} style={{ marginTop: '0.1rem', paddingLeft: '0.2rem', borderLeft: '2px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '0.2rem', fontSize: '0.28rem' }}>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>{c.author}</span>
                  <span style={{ color: 'var(--text-soft)' }}>{c.date}</span>
                </div>
                <p style={{ fontSize: '0.3rem', color: 'var(--text-soft)' }}>{c.content}</p>
              </div>
            ))}

            {/* Add Comment */}
            <div style={{ display: 'flex', gap: '0.1rem', marginTop: '0.1rem' }}>
              <input value={newComment[post.id] || ''} onChange={e => setNewComment({ ...newComment, [post.id]: e.target.value })} placeholder="Комментарий..." style={{ ...inputStyle, flex: 1, fontSize: '0.3rem' }} />
              <button onClick={() => handleComment(post.id)} style={{ ...btnStyle, fontSize: '0.28rem' }}>→</button>
            </div>
          </div>
        ))}

        {club.posts.length === 0 && club.polls.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-soft)', fontSize: '0.4rem' }}>
            Пока нет обсуждений. Начните первое!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.3rem' }}>
        <h2 style={{ fontSize: '0.8rem', color: 'var(--heading)' }}>📖 Книжные клубы</h2>
        <button onClick={() => setShowCreate(!showCreate)} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>+ Создать клуб</button>
      </div>

      {showCreate && (
        <div className="animate-slide-up" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.4rem', marginBottom: '0.4rem', boxShadow: 'var(--shadow)' }}>
          <h4 style={{ fontSize: '0.42rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>Новый клуб</h4>
          <input value={clubName} onChange={e => setClubName(e.target.value)} placeholder="Название клуба..." style={{ ...inputStyle, width: '100%', marginBottom: '0.1rem' }} />
          <textarea value={clubDesc} onChange={e => setClubDesc(e.target.value)} placeholder="Описание..." style={{ ...inputStyle, width: '100%', minHeight: '1rem', resize: 'vertical', marginBottom: '0.1rem' }} />
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <button onClick={handleCreateClub} style={{ ...btnStyle, background: 'var(--primary)', color: '#fff' }}>✓ Создать</button>
            <button onClick={() => setShowCreate(false)} style={btnStyle}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.3rem' }}>
        {clubs.map((club, i) => (
          <div key={club.id} className="animate-slide-up" onClick={() => setSelectedClub(club)} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px',
            padding: '0.4rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: 'var(--shadow)',
            animationDelay: `${i * 0.08}s`, animationFillMode: 'both'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          >
            <h3 style={{ fontSize: '0.5rem', color: 'var(--heading)', marginBottom: '0.1rem' }}>{club.name}</h3>
            <p style={{ fontSize: '0.35rem', color: 'var(--text-soft)', marginBottom: '0.15rem' }}>{club.description}</p>
            <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.3rem', color: 'var(--text-soft)' }}>
              <span>👥 {club.members.length}</span>
              <span>📝 {club.posts.length} постов</span>
              <span>📊 {club.polls.length} опросов</span>
            </div>
          </div>
        ))}
      </div>

      {clubs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-soft)', fontSize: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.3rem' }}>📖</span>
          Создайте свой первый книжный клуб!
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
