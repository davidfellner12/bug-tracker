import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:5000';

function App() {
    const [bugs, setBugs] = useState([]);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');
    const [editBugId, setEditBugId] = useState(null);

    useEffect(() => {
        fetchBugs();
    }, []);

    const fetchBugs = async () => {
        try {
            const response = await fetch(`${API_URL}/bugs`);
            const data = await response.json();
            setBugs(data);
        } catch (error) {
            console.error('Error fetching bugs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) {
            alert('Title is required');
            return;
        }

        const bugData = { title, status, priority };
        
        try {
            let response;
            if (editBugId) {
                response = await fetch(`${API_URL}/bugs/${editBugId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bugData),
                });
            } else {
                response = await fetch(`${API_URL}/bugs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bugData),
                });
            }

            if (response.ok) {
                fetchBugs();
                resetForm();
            } else {
                console.error('Failed to save bug');
            }
        } catch (error) {
            console.error('Error saving bug:', error);
        }
    };

    const handleEdit = (bug) => {
        setEditBugId(bug.id);
        setTitle(bug.title);
        setStatus(bug.status);
        setPriority(bug.priority);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/bugs/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchBugs();
            } else {
                console.error('Failed to delete bug');
            }
        } catch (error) {
            console.error('Error deleting bug:', error);
        }
    };

    const resetForm = () => {
        setEditBugId(null);
        setTitle('');
        setStatus('open');
        setPriority('medium');
    };

    return (
        <div className="container">
            <h1>Bug Tracker</h1>
            <form onSubmit={handleSubmit} className="bug-form">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Bug title"
                    required
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button type="submit">{editBugId ? 'Update Bug' : 'Add Bug'}</button>
                {editBugId && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <div className="bug-list">
                {bugs.map((bug) => (
                    <div key={bug.id} className={`bug-item ${bug.priority}`}>
                        <div className="bug-details">
                            <h3>{bug.title}</h3>
                            <p>Status: <span className={`status ${bug.status}`}>{bug.status}</span></p>
                            <p>Priority: {bug.priority}</p>
                        </div>
                        <div className="bug-actions">
                            <button onClick={() => handleEdit(bug)}>Edit</button>
                            <button onClick={() => handleDelete(bug.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;