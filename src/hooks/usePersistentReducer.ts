import { useReducer, useEffect, useRef } from 'react';
import type { Reducer } from 'react';

export function usePersistentReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  storageKey: string
): [S, React.Dispatch<A>] {
  
  const initializer = (defaultState: S): S => {
    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error(`Failed to parse state from localStorage key "${storageKey}"`, error);
    }
    return defaultState;
  };

  const [state, dispatch] = useReducer(reducer, initialState, initializer);

  // Use a ref to prevent the effect from running on the initial render
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Don't save to localStorage on the first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, dispatch];
}