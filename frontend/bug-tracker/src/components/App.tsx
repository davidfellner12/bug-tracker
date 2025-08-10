import { useState, useContext } from 'react';
import '../App.css';
import * as Sentry from '@sentry/react';
import { useBugs } from '../hooks/useBugs';
import BugForm from './BugForm';
import BugList from './BugList';
import DarkModeToggle from './DarkModeToggle';
import { AuthContext } from '../contexts/AuthContext';

function App() {
    const { logout } = useContext(AuthContext);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const { bugs, error, loading, addBug, updateBug, deleteBug, setError } = useBugs({ status: statusFilter, priority: priorityFilter });
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');
    const [editBugId, setEditBugId] = useState<string | null>(null);

    const handleFormSubmit = async (bugData: { title: string; status: string; priority: string }) => {
        if (editBugId) {
            await updateBug(editBugId, bugData);
        } else {
            await addBug(bugData);
        }
        resetForm();
    };

    const handleEditClick = (bug: { id: string; title: string; status: string; priority: string }) => {
        setEditBugId(bug.id);
        setTitle(bug.title);
        setStatus(bug.status);
        setPriority(bug.priority);
    };

    const handleDeleteClick = async (id: string) => {
        await deleteBug(id);
    };

    const resetForm = () => {
        setEditBugId(null);
        setTitle('');
        setStatus('open');
        setPriority('medium');
        setError(null); // Clear error from useBugs hook
    };

    const triggerSentryError = () => {
        try {
            // This will throw an error
            // @ts-ignore
            nonExistentFunction();
        } catch (error) {
            Sentry.captureException(error);
            setError("A test error has been sent to Sentry.");
        }
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Bug Tracker</h1>
                <div className="header-buttons">
                    <DarkModeToggle />
                    <button onClick={logout} className="logout-button">Logout</button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading && <div className="loading-message">Loading bugs...</div>}

            <BugForm
                initialBug={editBugId ? { id: editBugId, title, status, priority } : undefined}
                onSubmit={handleFormSubmit}
                onCancel={editBugId ? resetForm : undefined}
            />

            <div className="filters">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <BugList bugs={bugs} handleEdit={handleEditClick} handleDelete={handleDeleteClick} />

            <div className="sentry-test">
                <button onClick={triggerSentryError}>Test Sentry</button>
            </div>
        </div>
    );
}

export default App;
