export interface Value {
  id: string;
  name: string;
  definition: string;
}

export interface CanvasCard {
  instanceId: string;
  value: Value;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isCore: boolean;
  zIndex: number; // <-- ADD THIS LINE
}

export interface GameState {
  round: 'welcome' | 'round1' | 'round2' | 'round3' | 'results';
  zIndexCounter: number; // <-- ADD THIS LINE
  round1: { bank: Value[]; mostImportant: Value[]; somewhatImportant: Value[]; notImportant: Value[] };
  round2: { bank: Value[]; canvas: CanvasCard[]; topTenSlots: (Value | null)[]; additionalSlots: (Value | null)[] };
  round3: { coreValues: Value[]; additionalValues: Value[]; mappedCanvas: CanvasCard[] };
}

// Defines the shape of a card being dragged in Round 2
type DraggedItemSourceR2 =
  | { type: 'bank'; value: Value }
  | { type: 'canvas'; card: CanvasCard }
  | { type: 'slot'; value: Value; slotType: 'topTen' | 'additional'; index: number };

export type GameAction =
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'START_GAME'; payload: { allValues: Value[] } }
  | { type: 'RESTART_GAME' }
  // Navigation Actions
  | { type: 'GO_BACK_TO_ROUND_1' }
  | { type: 'GO_BACK_TO_ROUND_2' }
  | { type: 'GO_BACK_TO_ROUND_3' }
  // Round 1 Actions
  | { type: 'SORT_VALUE_R1'; payload: { valueId: string; sourceList: keyof GameState['round1']; destinationList: keyof GameState['round1'] } }
  | { type: 'ADVANCE_TO_ROUND_2' }
  // Round 2 Actions
  | { type: 'PLACE_IN_SLOT_R2'; payload: { item: DraggedItemSourceR2; slotType: 'topTen' | 'additional'; index: number } }
  | { type: 'PLACE_ON_CANVAS_R2'; payload: { item: DraggedItemSourceR2; position: { x: number; y: number } } }
  | { type: 'RETURN_TO_BANK_R2'; payload: { item: DraggedItemSourceR2 } }
  | { type: 'UPDATE_CANVAS_POSITION_R2'; payload: { instanceId: string; position: { x: number; y: number } } }
  | { type: 'ADVANCE_TO_ROUND_3' }
  // Round 3 Actions
  | { type: 'COPY_TO_CANVAS_R3'; payload: { value: Value; isCore: boolean; position: { x: number; y: number } } }
  | { type: 'UPDATE_CANVAS_POSITION_R3'; payload: { instanceId: string; position: { x: number; y: number } } }
  | { type: 'UPDATE_CANVAS_SIZE_R3'; payload: { instanceId: string; size: { width: number; height: number } } }
  | { type: 'SWAP_VALUES_R3'; payload: { from: { list: 'core' | 'additional'; index: number }; to: { list: 'core' | 'additional'; index: number } } }
  // ADD THIS LINE
  | { type: 'RETURN_TO_BANK_R3'; payload: { card: CanvasCard; destinationList: 'core' | 'additional' } }
  | { type: 'ADVANCE_TO_RESULTS' }
  | { type: 'TEST_MOVE'; payload: { source: string; destination: string } };