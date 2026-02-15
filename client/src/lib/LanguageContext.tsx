import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Language } from './i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  getLocalizedPath: (path: string, targetLang?: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Extract language from URL path
function getLangFromPath(pathname: string): Language {
  const cleanPath = pathname.split(/[?#]/)[0];
  const segments = cleanPath.split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (['en', 'ru', 'uz'].includes(firstSegment)) {
    return firstSegment as Language;
  }

  return 'de'; // Default to German
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const [lang, setLangState] = useState<Language>(() => {
    // Initialize from URL path on first render
    if (typeof window !== 'undefined') {
      return getLangFromPath(window.location.pathname);
    }
    return 'de';
  });

  // Update language when URL changes
  useEffect(() => {
    const urlLang = getLangFromPath(location);
    if (urlLang !== lang) {
      setLangState(urlLang);
    }
  }, [location, lang]);

  // Navigate to new language path
  const setLang = (newLang: Language) => {
    const currentPath = window.location.pathname;
    const newPath = getLocalizedPath(currentPath, newLang);
    setLocation(newPath);
  };

  // Get localized path for a given route
  const getLocalizedPath = (path: string, targetLang?: Language): string => {
    const useLang = targetLang || lang;

    // Remove existing language prefix
    let cleanPath = path;
    const pathSegments = path.split('/').filter(Boolean);
    if (['en', 'ru', 'uz'].includes(pathSegments[0])) {
      cleanPath = '/' + pathSegments.slice(1).join('/');
    }

    // Ensure path starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    // Ensure path ends with /
    if (!cleanPath.endsWith('/')) {
      cleanPath += '/';
    }

    // Add language prefix for non-German
    if (useLang === 'de') {
      return cleanPath;
    }

    return `/${useLang}${cleanPath}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
