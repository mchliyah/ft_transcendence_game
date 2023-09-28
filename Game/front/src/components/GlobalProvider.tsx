import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalContextType {
  globalVariable: boolean;
  setGlobalVariable: (value: boolean) => void;
}

const initialValue = true;

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [globalVariable, setGlobalVariable] = useState<boolean>(initialValue);

  const contextValue: GlobalContextType = {
    globalVariable,
    setGlobalVariable,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
