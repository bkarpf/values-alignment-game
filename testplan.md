## **Values Alignment Game: QA Verification Plan**

This document outlines the full testing procedure for the application. Each section corresponds to a development prompt and must be completed before proceeding to the next stage.

### **Verification for Prompt 1: Project Scaffolding & Core Dependencies**

**Objective:** To confirm that the project's foundation, dependencies, and directory structure are correctly established.

**Checklist:**
-   [X] **Structural:** A new directory named `values-alignment-game` has been created.
-   [X] **Structural:** The `package.json` file exists and contains the following **`dependencies`**:
    -   `react` & `react-dom`
    -   `styled-components`
    -   `@dnd-kit/core`
    -   `@dnd-kit/sortable`
    -   `react-draggable`
    -   `react-zoom-pan-pinch`
    -   `html-to-image`
-   [X] **Structural:** The `package.json` file contains the following **`devDependencies`**:
    -   `vite`
    -   `typescript`
    -   `@types/react` & `@types/react-dom`
    -   `@vitejs/plugin-react`
    -   `@types/styled-components`
    -   `prettier`
    -   `husky`
    -   `lint-staged`
    -   `vitest`
    -   `jsdom`
    -   `@testing-library/react`
    -   `@testing-library/jest-dom`
    -   `cypress`
-   [X] **Structural:** A `.git` directory exists, confirming the repository was initialized.
-   [X] **Structural:** The `src` directory contains the following empty subdirectories:
    -   `components`
    -   `context`
    -   `hooks`
    -   `pages`
    -   `types`
    -   `utils`
-   [X] **Compilation:** Run `npm install` in the terminal. The command must complete without any errors.
-   [X] **Compilation:** Run `npm run dev` in the terminal. The application must start, and the default Vite welcome page should be visible in the browser at the specified local address without any console errors.

### **Verification for Prompt 2: Core Component Construction (Stateless)**

**Objective:** To verify that the fundamental, stateless UI components are built correctly and match the visual design specifications.

**Setup:** The developer must create a temporary `App.tsx` file to render each of these components with sample props to make them visible for testing.

**Checklist:**
-   [X] **Structural:** The following files have been created:
    -   `src/types/index.ts`
    -   `src/components/Button.tsx`
    -   `src/components/PageLayout.tsx`
    -   `src/components/InstructionsPanel.tsx`
    -   `src/components/ValueCard.tsx`
-   [X] **Compilation:** The application runs via `npm run dev` without any TypeScript or runtime errors in the console.
-   [ ] **Visual (`Button.tsx`):**
    -   [ ] Renders with the correct primary action color (`#007AFF`) and text color.
    -   [ ] On hover, the background color darkens as specified.
    -   [ ] When passed the `disabled` prop, the button appears grayed out and the cursor changes to `not-allowed`.
    -   [ ] When focusing with the `Tab` key, a clear focus outline is visible (Req 2.3).
-   [ ] **Visual (`InstructionsPanel.tsx`):**
    -   [ ] Renders with a distinct background (`#FFFFFF`), border, and padding.
    -   [ ] The `title` prop is rendered as a larger, semibold heading (`H2`).
    -   [ ] The `children` prop is rendered as body text with the correct font styles.
-   [ ] **Visual (`ValueCard.tsx`):**
    -   [ ] Renders at the specified fixed width (150px) with rounded corners (8px).
    -   [ ] Displays a default box-shadow (`0 2px 4px rgba(0,0,0,0.1)`).
    -   [ ] The `value.name` and `value.definition` are displayed with the correct typography.
    -   [ ] The `color` prop correctly overrides the default white background.
-   [ ] **Functional (`ValueCard.tsx`):**
    -   [ ] On mouse hover, the cursor changes to `grab` and the box-shadow becomes more pronounced.
    -   [ ] When the `isDragging` prop is `true`, the card scales up, rotates slightly (`transform: rotate(3deg)`), and the box-shadow becomes significantly more prominent (`0 5px 15px rgba(0,0,0,0.2)`).

### **Verification for Prompt 3: State Management & Data Structures**

**Objective:** To ensure the core application logic, state structure, and data persistence mechanisms are correctly implemented *before* they are connected to the UI.

**Setup:** This phase is non-visual. Verification will be done by running automated tests and inspecting logs/browser storage. The developer must write unit tests as specified in 6.4.3.1.

**Checklist:**
-   [ ] **Structural:** The following files have been created:
    -   `src/context/GameContext.tsx`
    -   `src/hooks/useGameLogic.ts`
    -   `src/data/values.ts` (or similar data file)
-   [ ] **Structural:** The `src/types/index.ts` file is updated with all necessary game state types (`GameState`, `Action`, etc.).
-   [ ] **Compilation:** The project compiles without any TypeScript errors.
-   [ ] **Functional (Unit Tests):**
    -   [ ] **Initial State:** A test confirms that the `initialState` object has `round: 'welcome'` and all data arrays are correctly initialized.
    -   [ ] **Reducer Action `START_GAME`:** A test dispatches this action and confirms the resulting state has `round: 'round1'` and the value bank is correctly populated.
    -   [ ] **Reducer Action `SORT_VALUE`:** A test simulates dragging a card from the `bank` to `mostImportant`. It must verify that the card is removed from the source array and added *alphabetically* to the destination array.
    -   [ ] **Reducer Action `ADVANCE_TO_ROUND_*`:** Tests for each round transition confirm that the `round` property is updated and the correct data payload is passed to the next round's state.
-   [ ] **Functional (Session Persistence):**
    -   [ ] In a test environment, dispatch a state-changing action (e.g., `SORT_VALUE`).
    -   [ ] **Verify:** The `localStorage` of the browser now contains a key (e.g., `values-game-session`) with a JSON string representing the new application state.
    -   [ ] **Verify:** The `useGameLogic` hook correctly checks for this key on initialization and hydrates the state from it.

### **Verification for Prompt 4: Assembling the Welcome Screen**

**Objective:** To verify the initial screen of the application is correctly assembled and functional.

**Checklist:**
-   [ ] **Structural:** The file `src/pages/WelcomeScreen.tsx` has been created.
-   [ ] **Compilation:** The application runs and displays the Welcome Screen by default without errors.
-   [ ] **Visual:**
    -   [ ] The screen uses the `PageLayout` component.
    -   [ ] An `InstructionsPanel` is displayed with the title "Discover Your Core Values" (or similar, per 7.3.1).
    -   [ ] A primary `Button` is displayed with the text "Begin Your Journey".
    -   [ ] The layout is clean, centered, and uses generous whitespace as per the wireframe.
-   [ ] **Functional:**
    -   [ ] Clicking the "Begin Your Journey" button dispatches the `START_GAME` action.
    -   [ ] After the click, the application navigates to the (currently blank or incomplete) Round 1 view. (Verify state change using React DevTools if UI is not ready).
    -   [ ] **Crucially:** Before clicking, add dummy data to `localStorage` under the session key. After clicking, verify that this `localStorage` entry has been cleared (Req 5.1).

### **Verification for Prompt 5: Assembling Round 1**

**Objective:** To verify the layout, drag-and-drop functionality, and navigation logic of the first round.

**Checklist:**
-   [ ] **Structural:** The file `src/pages/Round1.tsx` is implemented.
-   [ ] **Compilation:** Navigating to Round 1 displays the view without errors.
-   [ ] **Visual:**
    -   [ ] The layout is a multi-column view as specified (7.3.2).
    -   [ ] The `ValueBank` on the left is populated with `ValueCard` components.
    -   [ ] Three distinct drop zone containers ("Matters most," etc.) are displayed to the right.
    -   [ ] A "Next Round" button is visible in the page footer.
-   [ ] **Functional:**
    -   [ ] Drag a card from the `ValueBank` to the "Matters most" bin. The card should visually move and settle in the new container.
    -   [ ] Verify the state update: the card is removed from the `bank` array and added to the `mostImportant` array.
    -   [ ] Drag a card from "Matters most" to "Doesn't matter." Verify the state updates correctly between the two bin arrays.
    -   [ ] The "Next Round" button is `disabled` when the `ValueBank` is not empty.
    -   [ ] Drag the final card out of the `ValueBank`. The bank should now be empty.
    -   [ ] **Verify:** The "Next Round" button immediately becomes enabled.
    -   [ ] Click the "Next Round" button. The application should transition to the Round 2 view.
    -   [ ] **Accessibility:** Confirm you can navigate to the `ValueBank`, select a card with `Enter`/`Space`, move it between lists with arrow keys, and drop it with `Enter`/`Space` (core `dnd-kit` functionality).

### **Verification for Prompt 6: Assembling Round 2**

**Objective:** To verify the complex drag-and-drop logic, canvas interactions, and conditional navigation of the second round.

**Checklist:**
-   [ ] **Structural:** `src/pages/Round2.tsx`, `src/components/FreeCanvas.tsx`, and `src/components/ValueSlot.tsx` are implemented.
-   [ ] **Compilation:** Navigating to Round 2 displays the view without errors.
-   [ ] **Visual:**
    -   [ ] The layout matches the spec (Instructions, Bank/Canvas, Slot Rows).
    -   [ ] The two rows of 10 `ValueSlots` are displayed at the bottom, showing their placeholder text.
    -   [ ] When dragging a card, the borders of all *empty* `ValueSlots` and the `FreeCanvas` highlight to indicate they are valid drop targets (Req 7.2.3 & 7.3.3).
-   [ ] **Functional (Interaction Logic - Test each case from 5.3.3):**
    -   [ ] **Bank to Top Slot:** Drag a card from the bank to an empty "Top 10" slot. Verify the slot is filled and the bank state is updated.
    -   [ ] **Bank to Canvas:** Drag a card from the bank to the `FreeCanvas`. Verify a `CanvasCard` is added to the `canvasValues` state and the bank state is updated.
    -   [ ] **Canvas to Slot:** Drag a card from the `FreeCanvas` to an empty "Candidates" slot. Verify the slot is filled and the `canvasValues` state is updated.
    -   [ ] **Slot to Canvas:** Drag a card out of a "Top 10" slot and onto the canvas. Verify the slot becomes empty and the card is added to `canvasValues`.
    -   [ ] **Slot to Slot:** Drag a card from one slot to another *empty* slot. Verify the source becomes empty and the destination is filled.
    -   [ ] **Invalid Drop:** Drag a card and drop it on a *filled* slot. The card should animate back to its origin, and the state should not change.
-   [ ] **Functional (Canvas & Navigation):**
    -   [ ] **Zoom/Pan:** Verify the canvas can be zoomed with the mouse wheel and panned by dragging the background (Req 4.5).
    -   [ ] **Navigation:** The "Next Round" button must be disabled.
    -   [ ] Fill all 10 "Top 10" slots.
    -   [ ] **Verify:** The "Next Round" button becomes enabled.
    -   [ ] Click "Next Round." The application must transition to the Round 3 view.

### **Verification for Prompt 7: Assembling Round 3**

**Objective:** To verify the "copy-on-drag" mechanic, list swapping, and canvas resizing in the third round.

**Checklist:**
-   [ ] **Structural:** `src/pages/Round3.tsx` is implemented.
-   [ ] **Compilation:** Navigating to Round 3 displays the view without errors.
-   [ ] **Visual:**
    -   [ ] The `ValueBank` shows two distinct lists: "Core Values" and "Additional Values".
    -   [ ] Cards in the "Core Values" list have a white background.
    -   [ ] Cards in the "Additional Values" list have a light blue background (`#E6F7FF`).
-   [ ] **Functional:**
    -   [ ] **Copy to Canvas:** Drag a card from the "Core Values" list to the canvas. Verify a new `CanvasCard` is created, but the original card **remains in the bank** (Req 5.4.1).
    -   [ ] **Swap Logic:** Drag a card from the "Additional Values" list and drop it on top of the "Core Values" list. Verify the two cards swap places in their respective state arrays (Req 5.4.3).
    -   [ ] **Resizing:** Verify a resize handle exists on canvas cards. Drag the handle to resize a card. After the resize is complete, inspect the application state (via React DevTools) and confirm the `size` property for that `CanvasCard` has been updated (Req 5.4.2).
    -   [ ] **Navigation:** Click the "Finish" button. The application must transition to the Results Screen.

### **Verification for Prompt 8: Assembling the Results Screen**

**Objective:** To verify the final presentation screen, image export, and application reset functionality.

**Checklist:**
-   [ ] **Structural:** `src/pages/ResultsScreen.tsx` is implemented.
-   [ ] **Compilation:** Navigating to the Results Screen displays the view without errors.
-   [ ] **Visual:**
    -   [ ] A congratulatory title is displayed.
    -   [ ] The final value map from Round 3 is rendered in a static, non-interactive container.
    -   [ ] Two buttons, "Export as Image" and "Start Over," are present in the footer with distinct primary/secondary styling.
-   [ ] **Functional:**
    -   [ ] Click the "Export as Image" button. **Verify:** A browser download is triggered for a PNG file of the value map (Req 5.5).
    -   [ ] Click the "Start Over" button. **Verify:** A confirmation modal dialog appears, overlaying the screen (Req 7.3.5).
    -   [ ] In the modal, click "Cancel." The modal must close, and the application state remains unchanged.
    -   [ ] Re-open the modal and click "Yes, Start Over." **Verify:** The `localStorage` session is cleared, and the application navigates back to the Welcome Screen (Req 5.5).

### **Verification for Prompt 9: Final Assembly & End-to-End**

**Objective:** To perform a final system-wide check, focusing on routing, session persistence, and the complete user journey.

**Checklist:**
-   [ ] **Structural:** The main router logic in `App.tsx` (or equivalent) is complete.
-   [ ] **Compilation:** The entire application builds (`npm run build`) and runs (`npm run preview`) without any errors.
-   [ ] **Functional (Routing):** Using React DevTools, manually change the `round` property in the game state. Verify that the view correctly switches between `WelcomeScreen`, `Round1`, `Round2`, `Round3`, and `ResultsScreen`.
-   [ ] **Functional (Debug UI):**
    -   [ ] In development mode (`npm run dev`), verify a debug UI is present that allows one-click navigation to any round.
    -   [ ] In a production preview (`npm run build` then `npm run preview`), verify the debug UI is **not** present in the DOM (Req 2.4).
-   [ ] **Functional (Session Persistence - Critical Test):**
    -   [ ] Start a new game and proceed to Round 2.
    -   [ ] Drag several cards onto the canvas and into various slots.
    -   [ ] **Force a full browser refresh.**
    -   [ ] **VERIFY:** The application must reload directly to Round 2, with every card in the exact position it was in before the refresh (Req 2.2).
-   [ ] **Functional (Full End-to-End Flow):**
    -   [ ] Perform one final, complete user test. Start at the Welcome Screen and play through every round, making meaningful choices. Finish the game, view the results, export the image, and use the "Start Over" button to reset. The entire flow must be smooth, without errors, and behave exactly as specified in the documentation.