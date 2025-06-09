### **The C.R.A.F.T. Prompting Framework for Complex Code Generation**

This framework is designed to maximize accuracy by breaking down a large project into a sequence of verifiable steps. Each prompt we send will adhere to the **C.R.A.F.T.** model:

*   **C**ontext: Provide the **entire project specification** in every prompt. This is non-negotiable. It acts as the AI's long-term memory and source of truth. We will use a collapsible `<details>` tag to make it manageable.
*   **R**ole: Assign a **specific, expert persona** to the AI for each task (e.g., "You are a senior frontend engineer specializing in design systems").
*   **A**ction: Give a **single, unambiguous, and narrowly-scoped task**. The AI should only build one logical unit at a time (e.g., "Build only the presentational components," "Build only the state management context").
*   **F**ormat: Specify the **exact output format** required (e.g., "Provide the output as a single, complete code block for the file `src/components/ValueCard.tsx`").
*   **T**est: Define the **verification step** for the generated code. This tells the AI what "done" looks like and allows us to confirm its work.

### **Golden Rules for This Process**

1.  **One Prompt, One Logical Unit:** Do not combine prompts. Complete and verify each step before moving to the next.
2.  **Full Context, Every Time:** You **must** copy and paste the entire project specification document into the `<details>` block for every single prompt. This is the AI's memory.
3.  **Verify Each Step:** After running the code from each prompt, perform the "Test" step described in the prompt. If it fails, start a new chat session and add a note to the prompt: "In the previous attempt, there was an error [describe error]. Please correct this."
4.  **Do Not Edit Mid-Stream:** Do not ask the AI to "change" the code from a previous step. If a change is needed, go back to the prompt for that step, modify it, and regenerate from that point forward.

---

### **The Staged Prompt Sequence**

We will build the application in the same order a professional development team would: Foundation -> Components -> State -> Assembly.

**Here is the sequence of prompts you will use:**

1.  **Prompt 1: Project Scaffolding & Core Dependencies**
2.  **Prompt 2: Core Component Construction (Stateless)**
3.  **Prompt 3: State Management & Data Structures**
4.  **Prompt 4: Assembling the Welcome Screen & Page Layout**
5.  **Prompt 5: Assembling Round 1**
6.  **Prompt 6: Assembling Round 2**
7.  **Prompt 7: Assembling Round 3**
8.  **Prompt 8: Assembling the Results Screen**
9.  **Prompt 9: Final Assembly of the Main App Router**

After you receive and verify the output from one prompt, you will proceed to the next one in the sequence.

---

### **The Full Project Specification (To be used in every prompt)**

First, copy the full text of the three documents below into a single text file on your computer. You will paste this combined text into the `<details>` block of every prompt.

1.  `Project Specification: The Values Alignment Game (v4.0 - Definitive Build Plan)`
2.  `Architectural & Procedural Framework: The Values Alignment Game`
3.  `UI/UX Design Outline: The Values Alignment Game`

---

### **Prompt 1: Project Scaffolding & Core Dependencies**

```text
**ROLE:**
You are a Chief Architect with 30 years of experience setting up modern frontend applications. Your task is to generate the precise terminal commands and file structure for the "Values Alignment Game" based on the provided architectural plan.

**CONTEXT:**
The complete project specification is provided below for your reference. For this task, pay close attention to the "Architectural & Procedural Framework" to identify the chosen build tools and libraries.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE...]

</details>

**ACTION:**
Your task is to generate the exact, step-by-step terminal commands needed to:
1. Initialize a new project using Vite with the `react-ts` template.
2. Navigate into the new project directory.
3. Install all of the exact `dependencies` (`styled-components`, `dnd-kit`, `react-draggable`, `react-zoom-pan-pinch`, `html-to-image`) and `devDependencies` (`@types/styled-components`, `vitest`, `react-testing-library`, `cypress`, `eslint`, `prettier`, `husky`, `lint-staged`) specified in the architectural framework.
4. Initialize a Git repository.
5. Create the initial directory structure inside the `src` folder as follows: `src/components`, `src/pages`, `src/context`, `src/hooks`, `src/types`, `src/utils`.

**FORMAT:**
Provide the output as a single, clean block of shell commands. Add brief comments where necessary to explain a step.

**TEST (Verification):**
After running the commands, the `package.json` file should contain all the specified libraries, and the `src` folder should contain the empty directories you created.
```

---

### **Prompt 2: Core Component Construction (Stateless)**

```text
**ROLE:**
You are a Senior Frontend Engineer specializing in creating high-quality, reusable components for a design system, with a deep focus on accessibility and styling best practices.

**CONTEXT:**
The complete project specification is provided below for your reference.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE...]

</details>

**ACTION:**
Your task is to build ONLY the following stateless, presentational components. Adhere strictly to the detailed specifications in the "Core Component Library" and the "UI/UX Design Outline". The components must be written in TypeScript with `styled-components`.

1.  `PageLayout.tsx`
2.  `InstructionsPanel.tsx`
3.  `ValueCard.tsx`
4.  `Button.tsx`

Do NOT add any application state or complex logic. These components should only receive props and render UI.

**FORMAT:**
Provide the output as a series of complete, individual code blocks, each with its corresponding file path.

**TEST (Verification):**
The generated code should be free of type errors. I will place these components into a temporary `App.tsx` file to ensure they render correctly based on sample props.
```

---

### **Prompt 3: Interactive Component Construction**

```text
**ROLE:**
You are a Senior Frontend Engineer specializing in complex interactive UI, using libraries for drag-and-drop and user manipulation.

**CONTEXT:**
The complete project specification is provided below for your reference. You will also need the code for the `ValueCard` component, which has already been created.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE...]

</details>

**ACTION:**
Your task is to build ONLY the following interactive "container" components. These components will use the interaction libraries (`dnd-kit`, `react-draggable`, `react-zoom-pan-pinch`) but will NOT contain their own application state logic (they will receive data and handler functions via props).

1.  `ValueBank.tsx` (using `dnd-kit`)
2.  `ValueSlot.tsx` (using `dnd-kit`)
3.  `FreeCanvas.tsx` (using `react-draggable` and `react-zoom-pan-pinch`)

Adhere strictly to the specifications for props, presentation, and behavior.

**FORMAT:**
Provide the output as a series of complete, individual code blocks, each with its corresponding file path.

**TEST (Verification):**
The generated code should be free of type errors. I will place these components into a temporary `App.tsx` file with mock data to ensure they render correctly.
```

---

### **Prompt 4: State Management & Data Structures**

```text
**ROLE:**
You are a State Management Specialist with expertise in designing robust, type-safe state for React applications.

**CONTEXT:**
The complete project specification is provided below for your reference.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE...]

</details>

**ACTION:**
Your task is to create the foundational logic for the entire application's state.
1.  Create a `types.ts` file that defines all the core data structures (`Value`, `CanvasCard`) as specified in the project plan.
2.  Create a `GameContext.tsx` file. This file will:
    - Define the full application state interface (`GameState`).
    - Define all possible actions (`GameAction`) using a discriminated union.
    - Implement the `gameReducer` function to handle all state transitions.
    - Create and export the `GameContext` and `GameProvider`.

**FORMAT:**
Provide the output as two complete, individual code blocks with their corresponding file paths: `src/types/types.ts` and `src/context/GameContext.tsx`.

**TEST (Verification):**
The generated code must be fully typed and compile without errors. The reducer should cover all necessary actions for the application flow (e.g., sorting cards, moving to the next round, placing cards on the canvas).
```

---

### **Prompt 5: Assembling Round 1**

```text
**ROLE:**
You are a Senior Application Engineer responsible for assembling components and state into a fully functional user-facing page.

**CONTEXT:**
The complete project specification is provided below for your reference. You have access to all previously created components and the `GameContext`.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE...]

</details>

**ACTION:**
Your task is to build ONLY the `Round1.tsx` page component. This component will:
1.  Be wrapped in the `PageLayout` component.
2.  Use the `GameContext` to get the state for the four lists (`bank`, `mostImportant`, etc.) and the `dispatch` function.
3.  Implement the `onDragEnd` handler for `dnd-kit` to dispatch the correct actions when a card is moved.
4.  Render the `InstructionsPanel`, `ValueBank`, and the three category bins.
5.  Render the "Next Round" `Button` and manage its disabled state based on the `bank`'s length.

**FORMAT:**
Provide the output as a single, complete code block for the file `src/pages/Round1.tsx`.

**TEST (Verification):**
When this component is rendered within the `GameProvider`, it should display the initial state of Round 1. I should be able to drag cards between all containers, and the UI must update correctly. The "Next Round" button should enable only when the bank is empty.
```

---

### **Prompts 6, 7, 8: Assembling Subsequent Rounds**

*(These follow the same pattern as Prompt 5. You will execute them sequentially.)*

**Prompt 6: Assembling Round 2**
*   **ROLE:** Senior Application Engineer...
*   **CONTEXT:** [...Full Spec...]
*   **ACTION:** Build ONLY the `Round2.tsx` page component. It must use `PageLayout`, consume `GameContext`, and assemble the `ValueBank`, `FreeCanvas`, and `ValueSlot` components. Implement all drag-and-drop handlers to dispatch the correct state actions.
*   **FORMAT:** Single code block for `src/pages/Round2.tsx`.
*   **TEST:** The page should render with the correct data from Round 1. I can drag from the bank to the canvas or an empty slot. I can drag from the canvas to an empty slot. The "Next Round" button enables only when the 10 core slots are filled.

**Prompt 7: Assembling Round 3**
*   **ROLE:** Senior Application Engineer...
*   **CONTEXT:** [...Full Spec...]
*   **ACTION:** Build ONLY the `Round3.tsx` page component. It must use `PageLayout`, consume `GameContext`, and assemble the two-part `ValueBank` and the `FreeCanvas`. Implement the logic for creating copies on the canvas and for swapping values within the bank's lists.
*   **FORMAT:** Single code block for `src/pages/Round3.tsx`.
*   **TEST:** The page should render with the correct core and additional values. I can drag copies to the canvas, resize them, and swap items in the sidebar.

**Prompt 8: Assembling the Welcome & Results Screens**
*   **ROLE:** Senior Application Engineer...
*   **CONTEXT:** [...Full Spec...]
*   **ACTION:** Build ONLY the `WelcomeScreen.tsx` and `ResultsScreen.tsx` page components. The Results screen should implement the `html-to-image` logic for the "Export" button and the confirmation dialog for the "Start Over" button.
*   **FORMAT:** Two code blocks for `src/pages/WelcomeScreen.tsx` and `src/pages/ResultsScreen.tsx`.
*   **TEST:** The welcome screen button should work. The results screen should display a static map and the buttons should have the correct logic attached.

---

### **Prompt 9: Final Assembly & App Router**
```
**ROLE:**
You are a Lead Engineer responsible for the final assembly and application entry point.

**CONTEXT:**
The complete project specification is provided below for your reference. All page and context components have been created.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE...]

</details>

**ACTION:**
Your task is to build the final `App.tsx` file. This file will:
1.  Wrap the entire application in the `GameProvider` to make the state available everywhere.
2.  Read the `round` from the game state.
3.  Implement a conditional rendering logic (a simple `switch` statement is fine) to display the correct page component (`WelcomeScreen`, `Round1`, `Round2`, etc.) based on the current `round` in the state.
4.  Implement the Debug Navigation UI, ensuring it is only rendered if the correct environment variable is set.

**FORMAT:**
Provide the output as a single, complete code block for the file `src/App.tsx`.

**TEST (Verification):**
This is the final step. The application should now be fully functional. I can navigate through the entire game flow from start to finish. The session persistence should work on page refresh. The debug navigation should allow me to jump between rounds.
```
---

### **The Prompt for Generating the Testing Plan**

```text
**ROLE:**
You are a QA (Quality Assurance) Lead with 20 years of experience in frontend testing. You are an expert in manual testing, component verification, and end-to-end testing strategies.

**CONTEXT:**
The complete project specification for the "Values Alignment Game" is provided below. This specification details the application's architecture, components, UI/UX, and the 9-step plan that will be used to generate the code.

<details>
<summary>Expand to view Full Project Specification</summary>

[...PASTE THE ENTIRE COMBINED PROJECT SPECIFICATION DOCUMENT HERE, INCLUDING THE 9-STEP PROMPT FRAMEWORK...]

</details>

**ACTION:**
Your task is to create a comprehensive, step-by-step **Testing and Verification Plan**. This plan will be used by the developer after running the code generated by each of the 9 prompts. For each prompt, you must provide a clear, actionable checklist of tests to perform. The tests should cover:

1.  **Structural Verification:** Does the file structure and `package.json` match the requirements?
2.  **Compilation & Type Checking:** Does the code compile without errors?
3.  **Visual & Presentational Verification:** Does the component render correctly according to the UI/UX design?
4.  **Functional & Interactive Verification:** Does the component's behavior match the specified interaction logic?

**FORMAT:**
Provide the output as a well-structured Markdown document. Use clear headings for each prompt's testing phase (e.g., "### Verification Plan for Prompt 1: Project Scaffolding"). Under each heading, use a checklist format (`- [ ] Test description`) for the specific tests. Be explicit and leave no room for interpretation.

**TEST (Verification):**
The final output should be a complete testing manual that I can follow from start to finish to ensure the application is built correctly at every stage.
```

---

### **Expected Output (The Generated Testing Plan)**

Here is what the AI should generate. This is the plan you will follow.

***

## **QA Verification Plan: The Values Alignment Game**

This document provides the step-by-step testing procedures to be executed after each code generation prompt. Do not proceed to the next prompt until all tests for the current stage have passed.

### **Verification Plan for Prompt 1: Project Scaffolding**

*   **Objective:** To ensure the project foundation is correctly established.
*   **Checklist:**
    *   `[ ]` **Directory Check:** Confirm that a `value-finder` directory was created.
    *   `[ ]` **`package.json` Check (Dependencies):** Open the `package.json` file. Verify that `dependencies` contains `styled-components`, `dnd-kit`, `react-draggable`, `react-zoom-pan-pinch`, and `html-to-image`.
    *   `[ ]` **`package.json` Check (Dev Dependencies):** Verify that `devDependencies` contains `@types/styled-components`, `vitest`, `@testing-library/react`, `cypress`, `eslint`, `prettier`, `husky`, and `lint-staged`.
    *   `[ ]` **Git Check:** Confirm that a `.git` directory exists within the project folder.
    *   `[ ]` **Folder Structure Check:** Confirm that the `src` directory contains the following empty subdirectories: `components`, `pages`, `context`, `hooks`, `types`, `utils`.
    *   `[ ]` **Initial Compile Check:** Run `npm start` or `npm run dev`. The default Vite/React page should load in the browser without any errors.

### **Verification Plan for Prompt 2: Core Component Construction**

*   **Objective:** To verify that all stateless presentational components render correctly and match the design system.
*   **Procedure:**
    1.  Create a temporary file `src/pages/ComponentShowcase.tsx`.
    2.  In this file, import and render each of the four created components (`PageLayout`, `InstructionsPanel`, `ValueCard`, `Button`) with sample props.
*   **Checklist:**
    *   `[ ]` **Compilation Check:** The application must compile without any type errors.
    *   `[ ]` **`PageLayout` Test:**
        *   `[ ]` Renders its `children` correctly.
        *   `[ ]` Has consistent padding around the content.
    *   `[ ]` **`InstructionsPanel` Test:**
        *   `[ ]` Renders the `title` prop in a larger font.
        *   `[ ]` Renders the `children` prop as body text.
        *   `[ ]` Has a distinct background color as specified in the UI/UX outline.
    *   `[ ]` **`ValueCard` Test:**
        *   `[ ]` Renders the `value.name` and `value.definition`.
        *   `[ ]` Has a white background by default.
        *   `[ ]` When a `color` prop is passed, the background color updates.
        *   `[ ]` Has rounded corners and a subtle box-shadow.
    *   `[ ]` **`Button` Test:**
        *   `[ ]` Renders its `children` text.
        *   `[ ]` Is clickable and visually changes on hover.
        *   `[ ]` When the `disabled` prop is `true`, the button is visually grayed out and is not clickable.

### **Verification Plan for Prompt 3: Interactive Component Construction**

*   **Objective:** To verify that the interactive container components are structurally sound and ready to be wired to state.
*   **Procedure:**
    1.  Continue using the `src/pages/ComponentShowcase.tsx` file.
    2.  Import and render the three new components (`ValueBank`, `ValueSlot`, `FreeCanvas`) with mock data and empty handler functions (e.g., `onDragStop={() => console.log('drag stop')}`).
*   **Checklist:**
    *   `[ ]` **Compilation Check:** The application must compile without any type errors.
    *   `[ ]` **`ValueBank` Test:**
        *   `[ ]` Renders its `title` and a list of `ValueCard` components from the `values` prop.
        *   `[ ]` The cards are arranged in a wrapping horizontal layout.
        *   `[ ]` The cards are draggable.
    *   `[ ]` **`ValueSlot` Test:**
        *   `[ ]` When the `value` prop is `null`, it displays the `placeholderText`.
        *   `[ ]` When a `value` object is passed, it renders a `ValueCard`.
        *   `[ ]` The contained card is draggable.
    *   `[ ]` **`FreeCanvas` Test:**
        *   `[ ]` Renders `ValueCard` components at the specified `x` and `y` coordinates.
        *   `[ ]` The cards are draggable to new positions within the canvas.
        *   `[ ]` The canvas can be zoomed with the mouse wheel and panned by dragging the background.

### **Verification Plan for Prompt 4: State Management & Data Structures**

*   **Objective:** To ensure the application's "brain" is correctly defined.
*   **Procedure:** This is a code-only verification step. No UI rendering is required.
*   **Checklist:**
    *   `[ ]` **`types.ts` Check:**
        *   `[ ]` The file exists at `src/types/types.ts`.
        *   `[ ]` It exports `Value` and `CanvasCard` types with the correct properties and data types as specified in the project plan.
    *   `[ ]` **`GameContext.tsx` Check:**
        *   `[ ]` The file exists at `src/context/GameContext.tsx`.
        *   `[ ]` It defines and exports a `GameState` interface that includes properties for `currentRound`, `bank`, `mostImportant`, `canvasValues`, etc.
        *   `[ ]` It defines and exports a `GameAction` discriminated union type.
        *   `[ ]` The `gameReducer` function has a `switch` statement that covers all necessary actions (e.g., `SET_ROUND`, `MOVE_CARD_TO_BIN`, `PLACE_CARD_ON_CANVAS`).
        *   `[ ]` The entire file compiles without any TypeScript errors.

### **Verification Plan for Prompt 5: Assembling Round 1**

*   **Objective:** To test the first fully functional page of the application.
*   **Procedure:**
    1.  Modify `App.tsx` to render the `Round1` component, wrapped inside the `GameProvider`.
*   **Checklist:**
    *   `[ ]` **Initial Render:** The page loads showing the `InstructionsPanel`, the `ValueBank` full of alphabetized cards, and three empty bins.
    *   `[ ]` **Button State:** The "Next Round" button is disabled.
    *   `[ ]` **Drag and Drop:**
        *   `[ ]` Drag a card from the bank to the "Matters most" bin. The card should disappear from the bank and appear in the bin.
        *   `[ ]` Drag a second card to the same bin. The bin should now contain two cards, sorted alphabetically.
        *   `[ ]` Drag a card from one bin to another. The card should move correctly.
    *   `[ ]` **Completion Logic:** Drag all cards out of the bank.
    *   `[ ]` **Button State Update:** The "Next Round" button becomes enabled.
    *   `[ ]` **Navigation:** Clicking "Next Round" successfully updates the application state to `currentRound: 2`.

### **Verification Plan for Prompts 6, 7, 8, 9**

*(This follows the same pattern of increasing integration.)*

*   **Verification for `Round2.tsx`:**
    *   `[ ]` **Initial Render:** The page loads with the correct values from Round 1 in its `ValueBank`. The canvas and slots are empty.
    *   `[ ]` **Interaction Tests:**
        *   `[ ]` Drag from bank -> canvas.
        *   `[ ]` Drag from bank -> empty slot.
        *   `[ ]` Drag from canvas -> empty slot.
        *   `[ ]` Drag from slot -> canvas.
        *   `[ ]` Attempt to drag onto a filled slot (should be rejected).
    *   `[ ]` **Navigation:** Test the "Back" button and the "Next Round" button's disabled logic.

*   **Verification for `Round3.tsx`:**
    *   `[ ]` **Initial Render:** The page loads with "Core" and "Additional" values correctly displayed and colored in the sidebar.
    *   `[ ]` **Interaction Tests:**
        *   `[ ]` Drag from sidebar -> canvas (creates a copy).
        *   `[ ]` Resize a card on the canvas.
        *   `[ ]` Swap a core and additional value in the sidebar.
    *   `[ ]` **Navigation:** Test the "Back" and "Finish" buttons.

*   **Verification for `WelcomeScreen.tsx` & `ResultsScreen.tsx`:**
    *   `[ ]` **Welcome Screen:** The page renders and the "Begin" button works.
    *   `[ ]` **Results Screen:**
        *   `[ ]` The static map renders correctly.
        *   `[ ]` The "Export as Image" button triggers a file download.
        *   `[ ]` The "Start Over" button shows a confirmation dialog before clearing the session.

*   **Final Verification for `App.tsx`:**
    *   `[ ]` **Full Flow:** Complete the entire game from the Welcome Screen to the Results Screen without errors.
    *   `[ ]` **Session Persistence:** At Round 2, refresh the browser. The application should reload to Round 2 with all cards in their correct positions.
    *   `[ ]` **Debug Navigation:** Enable the debug environment variable. Verify the debug navigation bar appears and allows jumping between rounds.