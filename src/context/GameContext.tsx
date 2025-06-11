import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction } from '../types/types';
import { initialState, gameReducer } from './gameLogic';

const LOCAL_STORAGE_KEY = 'values-game-session';

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const initializer = (defaultState: GameState): GameState => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error(`Failed to parse state from localStorage key "${LOCAL_STORAGE_KEY}"`, error);
    }
    return defaultState;
  };

  const [state, dispatch] = useReducer(gameReducer, initialState, initializer);

  // This is the StrictMode-safe effect for persistence.
  useEffect(() => {
    // This function will be called when the component unmounts.
    // In StrictMode, it runs after the first render.
    // We can use it to save the state, ensuring it only happens once on changes.
    const handler = () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    };

    // Add the event listener for page-hide events (more reliable than beforeunload)
    window.addEventListener('pagehide', handler);

    // The cleanup function will remove the listener
    return () => {
      window.removeEventListener('pagehide', handler);
    };
  }, [state]); // This effect re-runs ONLY when the state object changes.

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};