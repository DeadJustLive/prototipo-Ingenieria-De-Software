import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'pasajero' | 'aduanas' | 'pdi' | 'sag' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const mockUsers: Record<string, { password: string; user: User }> = {
  'pasajero1': {
    password: '123456',
    user: {
      id: '1',
      username: 'pasajero1',
      name: 'María González',
      role: 'pasajero',
      email: 'maria.gonzalez@example.cl'
    }
  },
  'aduanas1': {
    password: '123456',
    user: {
      id: '2',
      username: 'aduanas1',
      name: 'Carlos Muñoz',
      role: 'aduanas',
      email: 'carlos.munoz@aduana.cl'
    }
  },
  'pdi1': {
    password: '123456',
    user: {
      id: '3',
      username: 'pdi1',
      name: 'Andrea Silva',
      role: 'pdi',
      email: 'andrea.silva@pdi.cl'
    }
  },
  'sag1': {
    password: '123456',
    user: {
      id: '4',
      username: 'sag1',
      name: 'Roberto Pérez',
      role: 'sag',
      email: 'roberto.perez@sag.cl'
    }
  },
  'admin1': {
    password: '123456',
    user: {
      id: '5',
      username: 'admin1',
      name: 'Patricia Rojas',
      role: 'admin',
      email: 'patricia.rojas@aduana.cl'
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // CP-01.04: Empty fields
    if (!username || !password) {
      return { success: false, error: 'Todos los campos son obligatorios' };
    }

    // CP-01.03: User doesn't exist
    if (!mockUsers[username]) {
      return { success: false, error: 'Usuario no encontrado en el sistema' };
    }

    // CP-01.02: Wrong password
    if (mockUsers[username].password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // CP-01.01: Successful login
    setUser(mockUsers[username].user);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
