import { createContext, useReducer, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction } from '../types/types';
import { initialState, gameReducer } from './gameLogic';

const LOCAL_STORAGE_KEY = 'values-game-session';

// --- Context Setup ---

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

// We are intentionally exporting a non-component here. This is a standard
// pattern for React contexts, so we can safely disable the linter rule.
// eslint-disable-next-line react-refresh/only-export-components
export const GameContext = createContext<GameContextType | undefined>(undefined);

// The provider component that wraps the application
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const initializer = (defaultState: GameState): GameState => {
    try {
      const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error("Failed to parse state from localStorage", error);
    }
    return defaultState;
  };

  const [state, dispatch] = useReducer(gameReducer, initialState, initializer);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// We are intentionally exporting a non-component here. This is a standard
// pattern for React contexts, so we can safely disable the linter rule.
// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};