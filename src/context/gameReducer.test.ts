import { describe, it, expect } from 'vitest';
// CORRECTED PATH: We now import from the new gameLogic.ts file
import { initialState, gameReducer } from './gameLogic';
import type { GameState, Value } from '../types/types';

// Mock data for testing
const mockValues: Value[] = [
  { id: 'val-c', name: 'Creativity', definition: '...' },
  { id: 'val-a', name: 'Adventure', definition: '...' },
  { id: 'val-b', name: 'Bravery', definition: '...' },
];

describe('gameReducer', () => {
  it('should return the initial state', () => {
    // This test satisfies the "Initial State" requirement
    expect(initialState.round).toBe('welcome');
    expect(initialState.round1.bank).toEqual([]);
  });

  it('should handle START_GAME action', () => {
    // This test satisfies the "Reducer Action START_GAME" requirement
    const action = { type: 'START_GAME' as const, payload: { allValues: mockValues } };
    const newState = gameReducer(initialState, action);

    expect(newState.round).toBe('round1');
    expect(newState.round1.bank).toEqual(mockValues);
    expect(newState.round1.mostImportant).toEqual([]);
  });

  it('should handle SORT_VALUE_R1 action and sort the destination list', () => {
    // This test satisfies the "Reducer Action SORT_VALUE" requirement
    const startState: GameState = {
      ...initialState,
      round: 'round1',
      round1: {
        bank: [mockValues[0], mockValues[1]], // Creativity, Adventure
        mostImportant: [mockValues[2]], // Bravery
        somewhatImportant: [],
        notImportant: [],
      },
    };

    const action = {
      type: 'SORT_VALUE_R1' as const,
      payload: { valueId: 'val-a', sourceList: 'bank' as const, destinationList: 'mostImportant' as const },
    };
    const newState = gameReducer(startState, action);

    // 1. Verify card was removed from source
    expect(newState.round1.bank.find(v => v.id === 'val-a')).toBeUndefined();
    expect(newState.round1.bank.length).toBe(1);

    // 2. Verify card was added to destination
    expect(newState.round1.mostImportant.find(v => v.id === 'val-a')).toBeDefined();
    expect(newState.round1.mostImportant.length).toBe(2);

    // 3. Verify destination list is now alphabetically sorted
    expect(newState.round1.mostImportant.map(v => v.name)).toEqual(['Adventure', 'Bravery']);
  });

  it('should handle ADVANCE_TO_ROUND_2 action', () => {
    // This test satisfies the "Reducer Action ADVANCE_TO_ROUND_*" requirement
    const startState: GameState = {
      ...initialState,
      round: 'round1',
      round1: {
        bank: [],
        mostImportant: [mockValues[0], mockValues[1]],
        somewhatImportant: [mockValues[2]],
        notImportant: [],
      },
    };
    const action = { type: 'ADVANCE_TO_ROUND_2' as const };
    const newState = gameReducer(startState, action);

    expect(newState.round).toBe('round2');
    // Verify correct data payload was passed
    expect(newState.round2.bank).toEqual(startState.round1.mostImportant);
    // Verify other parts of round 2 state are fresh
    expect(newState.round2.canvas).toEqual([]);
  });
});