import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children, initialUserRole = '', initialUserEmail = '' }) => {
  const [userRole, setUserRole] = useState(initialUserRole);
  const [userEmail, setUserEmail] = useState(initialUserEmail);

  return (
    <UserContext.Provider value={{ userRole, userEmail, setUserRole, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
