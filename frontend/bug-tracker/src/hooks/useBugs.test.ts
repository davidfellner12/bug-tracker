import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBugs } from './useBugs';
import { AuthContext } from '../contexts/AuthContext';

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock AuthContext
const mockAuthContextValue = {
  logout: vi.fn(),
  isAuthenticated: true,
  login: vi.fn(),
};

describe('useBugs', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('token', 'fake-token'); // Ensure a token is present for authenticated calls
  });

  it('fetches bugs successfully', async () => {
    const mockBugs = [
      { id: '1', title: 'Bug 1', status: 'open', priority: 'high' },
      { id: '2', title: 'Bug 2', status: 'closed', priority: 'low' },
    ];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockBugs),
    });

    const { result } = renderHook(() => useBugs({}), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockAuthContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bugs).toEqual(mockBugs);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Network error' }),
    });

    const { result } = renderHook(() => useBugs({}), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockAuthContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.bugs).toEqual([]);
    expect(result.current.error).toBe('Network error');
  });

  it('adds a bug successfully', async () => {
    const newBug = { title: 'New Bug', status: 'open', priority: 'medium' };
    const addedBug = { id: '3', ...newBug };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]), // For initial fetch
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(addedBug),
    });

    const { result } = renderHook(() => useBugs({}), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockAuthContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false)); // Wait for initial fetch

    result.current.addBug(newBug);

    await waitFor(() => expect(result.current.bugs).toContainEqual(addedBug));
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/bugs'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newBug),
      })
    );
  });

  it('updates a bug successfully', async () => {
    const initialBug = { id: '1', title: 'Bug 1', status: 'open', priority: 'high' };
    const updatedBug = { id: '1', title: 'Updated Bug', status: 'closed', priority: 'low' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([initialBug]), // For initial fetch
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(updatedBug),
    });

    const { result } = renderHook(() => useBugs({}), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockAuthContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false)); // Wait for initial fetch

    result.current.updateBug(initialBug.id, { title: updatedBug.title, status: updatedBug.status, priority: updatedBug.priority });

    await waitFor(() => expect(result.current.bugs).toContainEqual(updatedBug));
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/bugs/${initialBug.id}`),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ title: updatedBug.title, status: updatedBug.status, priority: updatedBug.priority }),
      })
    );
  });

  it('deletes a bug successfully', async () => {
    const bugToDelete = { id: '1', title: 'Bug 1', status: 'open', priority: 'high' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([bugToDelete]), // For initial fetch
    }).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}), // For delete operation
    });

    const { result } = renderHook(() => useBugs({}), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockAuthContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false)); // Wait for initial fetch

    result.current.deleteBug(bugToDelete.id);

    await waitFor(() => expect(result.current.bugs).not.toContainEqual(bugToDelete));
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/bugs/${bugToDelete.id}`),
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});
