import type { GameState, GameAction, Value, CanvasCard } from '../types/types';

// FIX: Add zIndexCounter to the initial state
export const initialState: GameState = {
  round: 'welcome',
  zIndexCounter: 1, // Start counter at 1
  round1: { bank: [], mostImportant: [], somewhatImportant: [], notImportant: [] },
  round2: { bank: [], canvas: [], topTenSlots: Array(10).fill(null), additionalSlots: Array(10).fill(null) },
  round3: { coreValues: [], additionalValues: [], mappedCanvas: [] },
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'START_GAME':
      localStorage.removeItem('values-game-session');
      return {
        ...initialState,
        round: 'round1',
        round1: {
          ...initialState.round1,
          bank: action.payload.allValues,
        },
      };
    case 'RESTART_GAME':
      localStorage.removeItem('values-game-session');
      return { ...initialState, round: 'welcome' };

    // --- Navigation ---
    case 'GO_BACK_TO_ROUND_1':
      return { ...state, round: 'round1' };
    case 'GO_BACK_TO_ROUND_2':
      return { ...state, round: 'round2' };
    case 'GO_BACK_TO_ROUND_3':
      return { ...state, round: 'round3' };

    // --- Round 1 ---
    case 'SORT_VALUE_R1': {
      const { valueId, sourceList, destinationList } = action.payload;
      const sourceArray = [...state.round1[sourceList]];
      const destArray = [...state.round1[destinationList]];
      const valueIndex = sourceArray.findIndex(v => v.id === valueId);
      if (valueIndex === -1) return state;
      const [value] = sourceArray.splice(valueIndex, 1);
      destArray.push(value);
      destArray.sort((a, b) => a.name.localeCompare(b.name));
      return { ...state, round1: { ...state.round1, [sourceList]: sourceArray, [destinationList]: destArray } };
    }
    case 'ADVANCE_TO_ROUND_2':
      return { ...state, round: 'round2', round2: { ...initialState.round2, bank: state.round1.mostImportant } };

    // --- Round 2 ---
    case 'PLACE_IN_SLOT_R2': {
      const { item, slotType, index } = action.payload;
      const valueToPlace = item.type === 'canvas' ? item.card.value : item.value;
      const { bank: initialBank, canvas: initialCanvas, topTenSlots: initialTop, additionalSlots: initialAdd } = state.round2;
      let bank = [...initialBank];
      let canvas = [...initialCanvas];
      const topTenSlots = [...initialTop];
      const additionalSlots = [...initialAdd];

      if (item.type === 'bank') bank = bank.filter(v => v.id !== item.value.id);
      if (item.type === 'canvas') canvas = canvas.filter(c => c.instanceId !== item.card.instanceId);
      if (item.type === 'slot') {
        if (item.slotType === 'topTen') topTenSlots[item.index] = null;
        else additionalSlots[item.index] = null;
      }
      if (slotType === 'topTen') topTenSlots[index] = valueToPlace;
      else additionalSlots[index] = valueToPlace;
      
      return { ...state, round2: { bank, canvas, topTenSlots, additionalSlots } };
    }
    case 'PLACE_ON_CANVAS_R2': {
        const { item, position } = action.payload;
        const valueToPlace = item.type === 'canvas' ? item.card.value : item.value;
        const { bank: initialBank, canvas: initialCanvas, topTenSlots: initialTop, additionalSlots: initialAdd } = state.round2;
        let bank = [...initialBank];
        let canvas = [...initialCanvas];
        const topTenSlots = [...initialTop];
        const additionalSlots = [...initialAdd];
        const newZIndex = state.zIndexCounter + 1;

        if (item.type === 'canvas') {
            // FIX: When moving a card, update its zIndex to bring it to the front
            canvas = canvas.map(c => c.instanceId === item.card.instanceId ? { ...c, position, zIndex: newZIndex } : c);
        } else {
            if (item.type === 'bank') {
                bank = bank.filter(v => v.id !== item.value.id);
            }
            if (item.type === 'slot') {
                if (item.slotType === 'topTen') topTenSlots[item.index] = null;
                else additionalSlots[item.index] = null;
            }
            // FIX: When creating a new card, assign it the next zIndex
            const newCard: CanvasCard = { instanceId: `canvas-${valueToPlace.id}-${Date.now()}`, value: valueToPlace, position, size: { width: 150, height: 100 }, isCore: false, zIndex: newZIndex };
            canvas.push(newCard);
        }

        // FIX: Increment the zIndexCounter in the state
        return { ...state, zIndexCounter: newZIndex, round2: { bank, canvas, topTenSlots, additionalSlots } };
    }
    case 'RETURN_TO_BANK_R2': {
      const { item } = action.payload;
      if (item.type === 'bank') return state;

      const valueToReturn = item.type === 'canvas' ? item.card.value : item.value;
      let { bank, canvas, topTenSlots, additionalSlots } = { ...state.round2 };

      if (item.type === 'canvas') canvas = canvas.filter(c => c.instanceId !== item.card.instanceId);
      if (item.type === 'slot') {
        if (item.slotType === 'topTen') topTenSlots[item.index] = null;
        else additionalSlots[item.index] = null;
      }
            
      bank = [...bank, valueToReturn].sort((a, b) => a.name.localeCompare(b.name));

      return { ...state, round2: { bank, canvas, topTenSlots, additionalSlots } };
    }
    case 'ADVANCE_TO_ROUND_3': {
      const coreValues = state.round2.topTenSlots.filter((v): v is Value => v !== null);
      const additionalValues = state.round2.additionalSlots.filter((v): v is Value => v !== null);
      return { ...state, round: 'round3', round3: { ...initialState.round3, coreValues, additionalValues } };
    }

    // --- Round 3 ---
    case 'COPY_TO_CANVAS_R3': {
      const { value, isCore, position } = action.payload;
  
      // 1. Check if a card with this value ID already exists on the canvas.
      const alreadyOnCanvas = state.round3.mappedCanvas.some(card => card.value.id === value.id);
  
      // 2. If it already exists, do nothing.
      if (alreadyOnCanvas) {
          return state;
      }
  
      // 3. If it doesn't exist, create and add the new card.
      const newZIndex = state.zIndexCounter + 1;
      const newCard: CanvasCard = { 
          instanceId: `canvas-${value.id}-${Date.now()}`, 
          value, 
          position, 
          size: { width: 150, height: 100 }, 
          isCore, 
          zIndex: newZIndex 
      };
  
      return { 
          ...state, 
          zIndexCounter: newZIndex, 
          round3: { ...state.round3, mappedCanvas: [...state.round3.mappedCanvas, newCard] } 
      };
  }
    case 'UPDATE_CANVAS_POSITION_R3': {
        const newZIndex = state.zIndexCounter + 1;
        // FIX: When moving a card, update its zIndex to bring it to the front
        const newMappedCanvas = state.round3.mappedCanvas.map(c => c.instanceId === action.payload.instanceId ? { ...c, position: action.payload.position, zIndex: newZIndex } : c );
        // FIX: Increment the zIndexCounter in the state
        return { ...state, zIndexCounter: newZIndex, round3: { ...state.round3, mappedCanvas: newMappedCanvas }};
    }
    case 'UPDATE_CANVAS_SIZE_R3': {
        const newZIndex = state.zIndexCounter + 1;
        // FIX: When resizing a card, update its zIndex to bring it to the front
        const newMappedCanvas = state.round3.mappedCanvas.map(c => c.instanceId === action.payload.instanceId ? { ...c, size: action.payload.size, zIndex: newZIndex } : c );
        // FIX: Increment the zIndexCounter in the state
        return { ...state, zIndexCounter: newZIndex, round3: { ...state.round3, mappedCanvas: newMappedCanvas }};
    }
    case 'SWAP_VALUES_R3': {
        const { from, to } = action.payload;
        const newCore = [...state.round3.coreValues];
        const newAdditional = [...state.round3.additionalValues];
        const fromList = from.list === 'core' ? newCore : newAdditional;
        const toList = to.list === 'core' ? newCore : newAdditional;
        const [movedItem] = fromList.splice(from.index, 1);
        if (movedItem) {
            toList.splice(to.index, 0, movedItem);
        }
        newCore.sort((a, b) => a.name.localeCompare(b.name));
        newAdditional.sort((a, b) => a.name.localeCompare(b.name));
        const newIsCoreStatus = to.list === 'core';
        const newMappedCanvas = state.round3.mappedCanvas.map(card => {
            if (card.value.id === movedItem?.id) {
                return { ...card, isCore: newIsCoreStatus };
            }
            return card;
        });
        return { 
            ...state, 
            round3: { 
                coreValues: newCore, 
                additionalValues: newAdditional,
                mappedCanvas: newMappedCanvas
            } 
        };
    }
    case 'RETURN_TO_BANK_R3': {
      const { card, destinationList } = action.payload;
      const valueToReturn = card.value;
      const newMappedCanvas = state.round3.mappedCanvas.filter(c => c.instanceId !== card.instanceId);
      const alreadyExistsInCore = state.round3.coreValues.some(v => v.id === valueToReturn.id);
      const alreadyExistsInAdditional = state.round3.additionalValues.some(v => v.id === valueToReturn.id);
      if (alreadyExistsInCore || alreadyExistsInAdditional) {
        return {
            ...state,
            round3: { ...state.round3, mappedCanvas: newMappedCanvas },
        };
      }
      const newCoreValues = [...state.round3.coreValues];
      const newAdditionalValues = [...state.round3.additionalValues];
      if (destinationList === 'core') {
        newCoreValues.push(valueToReturn);
      } else {
        newAdditionalValues.push(valueToReturn);
      }
      newCoreValues.sort((a, b) => a.name.localeCompare(b.name));
      newAdditionalValues.sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...state,
        round3: {
            mappedCanvas: newMappedCanvas,
            coreValues: newCoreValues,
            additionalValues: newAdditionalValues,
        },
      };
    }
    case 'ADVANCE_TO_RESULTS':
      return { ...state, round: 'results' };

    case 'TEST_MOVE': {
        return state;
    }
    
    default:
      return state;
  }
};