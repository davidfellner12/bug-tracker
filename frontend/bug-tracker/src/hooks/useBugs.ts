import { useState, useEffect, useContext } from 'react';
import * as Sentry from '@sentry/react';
import { AuthContext } from '../contexts/AuthContext';

const API_URL = 'http://127.0.0.1:5000';

interface Bug {
    id: string;
    title: string;
    status: string;
    priority: string;
}

interface BugInput {
    title: string;
    status: string;
    priority: string;
}

interface UseBugsProps {
    status?: string;
    priority?: string;
}

export const useBugs = ({ status, priority }: UseBugsProps) => {
    const { token } = useContext(AuthContext);
    const [bugs, setBugs] = useState<Bug[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (token) {
            fetchBugs();
        }
    }, [status, priority, token]);

    const getAuthHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchBugs = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (status) {
                params.append('status', status);
            }
            if (priority) {
                params.append('priority', priority);
            }
            const response = await fetch(`${API_URL}/bugs?${params.toString()}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error("Failed to fetch bugs");
            }
            const data = await response.json();
            setBugs(data);
        } catch (err) {
            console.error('Error fetching bugs:', err);
            setError('Failed to fetch bugs. Please try again later.');
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    const addBug = async (bugData: BugInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/bugs`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(bugData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add bug");
            }
            fetchBugs(); // Refresh the list
        } catch (err: any) {
            console.error('Error adding bug:', err);
            setError(`Failed to add bug: ${err.message}`);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    const updateBug = async (id: string, bugData: BugInput) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/bugs/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(bugData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update bug");
            }
            fetchBugs(); // Refresh the list
        } catch (err: any) {
            console.error('Error updating bug:', err);
            setError(`Failed to update bug: ${err.message}`);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteBug = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/bugs/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!response.ok) {
                throw new Error("Failed to delete bug");
            }
            fetchBugs(); // Refresh the list
        } catch (err: any) {
            console.error('Error deleting bug:', err);
            setError(`Failed to delete bug: ${err.message}`);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        bugs,
        error,
        loading,
        fetchBugs,
        addBug,
        updateBug,
        deleteBug,
        setError // Allow components to clear errors if needed
    };
};