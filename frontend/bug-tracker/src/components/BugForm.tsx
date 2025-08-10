import React, { useState, useEffect } from 'react';

interface BugFormProps {
    initialBug?: {
        id?: string;
        title: string;
        status: string;
        priority: string;
    };
    onSubmit: (bugData: { title: string; status: string; priority: string }) => void;
    onCancel?: () => void;
}

const BugForm: React.FC<BugFormProps> = ({ initialBug, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(initialBug?.title || '');
    const [status, setStatus] = useState(initialBug?.status || 'open');
    const [priority, setPriority] = useState(initialBug?.priority || 'medium');

    useEffect(() => {
        if (initialBug) {
            setTitle(initialBug.title);
            setStatus(initialBug.status);
            setPriority(initialBug.priority);
        } else {
            setTitle('');
            setStatus('open');
            setPriority('medium');
        }
    }, [initialBug]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) {
            alert('Title is required');
            return;
        }
        onSubmit({ title, status, priority });
    };

    return (
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
            <button type="submit">{initialBug ? 'Update Bug' : 'Add Bug'}</button>
            {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        </form>
    );
};

export default BugForm;