import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { AuthContext } from '../contexts/AuthContext';
import { useBugs } from '../hooks/useBugs';

// Mock the useBugs hook
vi.mock('../hooks/useBugs', () => ({
  useBugs: vi.fn(),
}));

// Mock the AuthContext
const mockLogout = vi.fn();
const mockAuthContextValue = {
  logout: mockLogout,
  isAuthenticated: true, // Assuming authenticated for App component
  login: vi.fn(),
};

describe('App', () => {
  it('renders Bug Tracker heading', () => {
    // Mock useBugs to return empty data and no loading/error
    vi.mocked(useBugs).mockReturnValue({
      bugs: [],
      error: null,
      loading: false,
      addBug: vi.fn(),
      updateBug: vi.fn(),
      deleteBug: vi.fn(),
      setError: vi.fn(),
    });

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Bug Tracker')).toBeInTheDocument();
  });

  // Add more tests here for interactions, conditional rendering, etc.
});
