'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type DatabaseType = 'ichigo' | 'asterdex';

interface DatabaseContextType {
  database: DatabaseType;
  setDatabase: (db: DatabaseType) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [database, setDatabaseState] = useState<DatabaseType>('ichigo');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selected-database') as DatabaseType;
    if (saved && (saved === 'ichigo' || saved === 'asterdex')) {
      setDatabaseState(saved);
    }
  }, []);

  // Save to localStorage when changed
  const setDatabase = (db: DatabaseType) => {
    setDatabaseState(db);
    localStorage.setItem('selected-database', db);
  };

  return (
    <DatabaseContext.Provider value={{ database, setDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

