
import { User } from '../types';

// Mock database in memory for simulation
const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', is_active: true, created_at: '2023-01-01' },
  { id: 2, name: 'Standard User', email: 'user@example.com', role: 'user', is_active: true, created_at: '2023-05-12' },
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  login: async (email: string, pass: string) => {
    await sleep(800);
    const user = MOCK_USERS.find(u => u.email === email);
    if (user && pass.length >= 6) {
      if (!user.is_active) throw new Error("Account is deactivated.");
      return { 
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
        user: { ...user } 
      };
    }
    throw new Error("Invalid credentials.");
  },

  register: async (name: string, email: string, pass: string) => {
    await sleep(1000);
    if (MOCK_USERS.find(u => u.email === email)) throw new Error("User already exists.");
    const newUser: User = {
      id: MOCK_USERS.length + 1,
      name,
      email,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  forgotPassword: async (email: string) => {
    await sleep(1200);
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) throw new Error("No user found with that email.");
    return { message: "Reset link sent to your email." };
  },

  resetPassword: async (token: string, pass: string) => {
    await sleep(1000);
    return { message: "Password updated successfully." };
  },

  getUsers: async () => {
    await sleep(500);
    return [...MOCK_USERS];
  },

  softDelete: async (id: number) => {
    await sleep(400);
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) user.is_active = false;
    return { message: "User deactivated." };
  }
};
