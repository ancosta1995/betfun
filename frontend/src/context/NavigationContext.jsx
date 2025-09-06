import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(window.innerWidth > 600);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
    setIsNavbarVisible(!isNavbarVisible);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    setIsNavbarVisible(window.innerWidth > 600);
  };

  return (
    <NavigationContext.Provider value={{ 
      isMobileNavOpen, 
      setIsMobileNavOpen,
      isNavbarVisible,
      setIsNavbarVisible,
      toggleMobileNav,
      closeMobileNav 
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 