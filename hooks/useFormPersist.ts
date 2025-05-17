import { useState, useEffect, useCallback } from 'react';

export function useFormPersist<T>(key: string, initialState: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use initialState for SSR
  const [isClient, setIsClient] = useState(false);
  // Initialize state from localStorage or use initialState
  const [state, setState] = useState<T>(initialState);

  // Initialize state from localStorage once on client-side
  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);


  // Update localStorage when state changes
  useEffect(() => {
    if (state !== initialState) {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn(`Error saving to localStorage key "${key}":`, error);
      }
    }
  }, [state, key, initialState]);

  // Clear form data when unmounting
  useEffect(() => {
    return () => {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
      }
    };
  }, [key]);

  const clearForm = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setState(initialState);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialState]);

  return [state, setState, clearForm];
}
