'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Leenar'ın otomatik bağlayacağı değişkenler
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setNotes(data);
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    
    await supabase.from('notes').insert([{ title, content }]);
    
    setTitle('');
    setContent('');
    await fetchNotes();
    setLoading(false);
  };

  const deleteNote = async (id: string) => {
    await supabase.from('notes').delete().eq('id', id);
    fetchNotes();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', color: '#f3f4f6', padding: '32px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#60a5fa' }}>
          Leenar Notlar
        </h1>
        
        <form onSubmit={addNote} style={{ backgroundColor: '#1f2937', padding: '24px', borderRadius: '8px', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '4px', backgroundColor: '#374151', color: 'white', border: 'none', boxSizing: 'border-box' }}
            required
          />
          <textarea
            placeholder="Not içeriği..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '4px', backgroundColor: '#374151', color: 'white', border: 'none', minHeight: '100px', resize: 'vertical', boxSizing: 'border-box' }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#4b5563' : '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Ekleniyor...' : 'Not Ekle'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notes.map((note) => (
            <div key={note.id} style={{ backgroundColor: '#1f2937', padding: '20px', borderRadius: '8px', position: 'relative' }}>
              <h3 style={{ fontSize: '18px', color: '#93c5fd', marginBottom: '8px', marginTop: '0' }}>{note.title}</h3>
              <p style={{ color: '#d1d5db', margin: '0', whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <button
                onClick={() => deleteNote(note.id)}
                style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'transparent', color: '#f87171', border: 'none', cursor: 'pointer' }}
              >
                Sil
              </button>
            </div>
      
          ))}
          {notes.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Henüz not yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
