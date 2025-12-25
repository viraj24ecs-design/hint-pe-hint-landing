import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface BookProgress {
  trialBook: number;
  richDadPoorDad: number;
  atomicHabits: number;
}

interface User {
  userId: string;
  username: string;
  name: string;
  email: string;
  dateOfBirth: string;
  charityCoins: number;
  bookProgress?: BookProgress;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  updateCoins: (coinsToAdd: number) => Promise<{ success: boolean; error?: string }>;
  updateBookProgress: (bookId: string, progress: number) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  username: string;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// OFFLINE MODE - Set to true for testing without backend
const OFFLINE_MODE = import.meta.env.VITE_OFFLINE_MODE === 'true' || false;

// Mock users for offline testing
const MOCK_USERS = [
  {
    userId: 'USER001',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    dateOfBirth: '1990-01-01',
    password: 'password123',
    charityCoins: 50,
    bookProgress: {
      trialBook: 0,
      richDadPoorDad: 0,
      atomicHabits: 0,
    },
  },
  {
    userId: 'USER002',
    username: 'demo',
    name: 'Demo User',
    email: 'demo@example.com',
    dateOfBirth: '1995-05-15',
    password: 'demo123',
    charityCoins: 100,
    bookProgress: {
      trialBook: 0,
      richDadPoorDad: 0,
      atomicHabits: 0,
    },
  },
];

// Use environment-aware API URL
const API_URL = import.meta.env.PROD 
  ? '/api/auth'  // Production: Use relative path for Vercel
  : 'http://localhost:5001/api/auth';  // Development: Use localhost

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token in localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      if (OFFLINE_MODE) {
        // In offline mode, restore user from localStorage
        const savedUser = localStorage.getItem('offlineUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          setIsLoggedIn(true);
        }
        setLoading(false);
      } else {
        fetchUserProfile(token);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    if (OFFLINE_MODE) return;
    
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // OFFLINE MODE
    if (OFFLINE_MODE) {
      const mockUser = MOCK_USERS.find(
        u => u.username === username && u.password === password
      );

      if (mockUser) {
        const { password: _, ...userWithoutPassword } = mockUser;
        setUser(userWithoutPassword);
        setIsLoggedIn(true);
        localStorage.setItem('authToken', 'offline-mock-token');
        localStorage.setItem('offlineUser', JSON.stringify(userWithoutPassword));
        console.log('🔧 OFFLINE MODE: Logged in as', username);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password (offline mode)' };
      }
    }

    // ONLINE MODE
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    // OFFLINE MODE
    if (OFFLINE_MODE) {
      const newUser = {
        userId: `USER${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
        charityCoins: 0,
      };

      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('authToken', 'offline-mock-token');
      localStorage.setItem('offlineUser', JSON.stringify(newUser));
      console.log('🔧 OFFLINE MODE: Signed up as', userData.username);
      return { success: true };
    }

    // ONLINE MODE
    try {
      console.log('Attempting signup to:', `${API_URL}/signup`);
      console.log('Signup data:', { ...userData, password: '***', confirmPassword: '***' });
      
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('offlineUser');
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateCoins = async (coinsToAdd: number): Promise<{ success: boolean; error?: string }> => {
    // OFFLINE MODE
    if (OFFLINE_MODE) {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const updatedUser = {
        ...user,
        charityCoins: (user.charityCoins || 0) + coinsToAdd,
      };

      setUser(updatedUser);
      localStorage.setItem('offlineUser', JSON.stringify(updatedUser));
      console.log('🔧 OFFLINE MODE: Added', coinsToAdd, 'coins. Total:', updatedUser.charityCoins);
      return { success: true };
    }

    // ONLINE MODE
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${API_URL}/update-coins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ coinsToAdd }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update user's coin count in state
        setUser(prev => prev ? { ...prev, charityCoins: data.charityCoins } : null);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to update coins' };
      }
    } catch (error) {
      console.error('Update coins error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const updateBookProgress = async (bookId: string, progress: number): Promise<{ success: boolean; error?: string }> => {
    // OFFLINE MODE
    if (OFFLINE_MODE) {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const updatedUser = {
        ...user,
        bookProgress: {
          ...user.bookProgress,
          trialBook: user.bookProgress?.trialBook || 0,
          richDadPoorDad: user.bookProgress?.richDadPoorDad || 0,
          atomicHabits: user.bookProgress?.atomicHabits || 0,
          [bookId]: Math.min(100, Math.max(0, progress)),
        },
      };

      setUser(updatedUser);
      localStorage.setItem('offlineUser', JSON.stringify(updatedUser));
      console.log('🔧 OFFLINE MODE: Updated', bookId, 'progress to', progress);
      return { success: true };
    }

    // ONLINE MODE
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      console.log('📊 Updating book progress:', { bookId, progress });
      console.log('🔗 API URL:', `${API_URL}/update-progress`);

      const response = await fetch(`${API_URL}/update-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, progress }),
      });

      console.log('📡 Response status:', response.status);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok) {
        // Update user's book progress in state
        setUser(prev => prev ? { ...prev, bookProgress: data.bookProgress } : null);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to update progress' };
      }
    } catch (error) {
      console.error('Update progress error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      await fetchUserProfile(token);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout, loading, updateCoins, updateBookProgress, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
