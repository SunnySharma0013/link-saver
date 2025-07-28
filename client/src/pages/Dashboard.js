import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [url, setUrl] = useState('');

  // ✅ Use your Render backend URL here:
 const API_URL = 'https://link-saver-fcy9.onrender.com/api/bookmarks';


  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookmarks');
        return res.json();
      })
      .then(data => setBookmarks(data))
      .catch(() => alert('Error loading bookmarks'));
  }, []);

  const saveBookmark = async () => {
    if (!url.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ url })
      });

      if (res.ok) {
        const newBookmark = await res.json();
        setBookmarks([...bookmarks, newBookmark]);
        setUrl('');
      } else {
        alert('Error saving bookmark');
      }
    } catch (err) {
      alert('Server error while saving bookmark');
    }
  };

  const deleteBookmark = async (id) => {
    if (!window.confirm('Delete this bookmark?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        setBookmarks(bookmarks.filter(b => b._id !== id));
      } else {
        alert('Error deleting bookmark');
      }
    } catch (err) {
      alert('Server error while deleting bookmark');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Your Bookmarks</h2>

      <input
        type="text"
        placeholder="Enter URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '70%', padding: '8px' }}
      />
      <button onClick={saveBookmark} style={{ marginLeft: '10px', padding: '8px 15px' }}>
        Save
      </button>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {bookmarks.map(b => (
          <li key={b._id} style={{ marginBottom: '10px', padding: '8px', border: '1px solid #ddd' }}>
            <a href={b.url} target="_blank" rel="noopener noreferrer">
              {b.title || 'No title'}
            </a>
            <button
              onClick={() => deleteBookmark(b._id)}
              style={{ marginLeft: '15px', color: 'white', background: 'red', border: 'none', padding: '5px 10px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
