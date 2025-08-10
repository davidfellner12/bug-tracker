import React from 'react';

interface Bug {
    id: string;
    title: string;
    status: string;
    priority: string;
}

interface BugListProps {
    bugs: Bug[];
    handleEdit: (bug: Bug) => void;
    handleDelete: (id: string) => void;
}

const BugList: React.FC<BugListProps> = ({ bugs, handleEdit, handleDelete }) => {
    return (
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
    );
};

export default BugList;