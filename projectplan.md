## **Project Specification: The Values Alignment Game (v4.0 - Definitive Build Plan)**

### **1.0 Project Vision & Core Mandate**

This document specifies the design and behavior of The Values Alignment Game, an interactive web application that enables users to identify, clarify, and map their personal core values. The development team is mandated to build the application precisely as described herein, employing a technology stack that best serves these requirements. The user experience must be fluid, intuitive, and reflective.

### **2.0 Global System Requirements & Architecture**

*   **2.1. Architecture: Component-Driven & State-Managed**
    *   The application **must** be built using a component-driven architecture. The components specified in Section 4.0 are the definitive building blocks.
    *   Application state (the current round, the contents of all containers, the position of all cards, etc.) **must** be managed in a centralized, predictable, and unidirectional data flow.

*   **2.2. Core Requirement: Session Persistence**
    *   The entire application state **must** be automatically saved to the user's local browser storage (`localStorage` is sufficient) after every state-changing action (e.g., a card drop, a navigation event).
    *   Upon application load (including a browser refresh), the system **must** first check for a saved session. If one exists, the application **must** rehydrate itself to that exact saved state. If no session exists, it **must** load to the Welcome Screen.

*   **2.3. Core Requirement: Accessibility (A11y)**
    *   All interactive elements (buttons, cards, navigation) **must** be keyboard-navigable (i.e., using `Tab` and `Enter`/`Space`).
    *   All interactive elements **must** have clear `focus` states (e.g., a visible outline).
    *   All non-textual UI elements (e.g., icons, if any) **must** have appropriate ARIA labels.
    *   Color contrast ratios **must** meet WCAG AA standards.

*   **2.4. Development Environment**
    *   The codebase **must** be written in TypeScript. All data structures, props, and functions **must** be explicitly typed.
    *   A pre-configured linter and code formatter **must** be used to enforce code quality and consistency.
    *   A debug navigation UI **must** be implemented that allows direct navigation to any round. This UI **must** be excluded from production builds via an environment variable.

### **3.0 Data Structures**

*   **3.1. `Value` Type:**
    *   `id`: `string` (A unique identifier, e.g., "value-accomplishment")
    *   `name`: `string` (e.g., "Accomplishment")
    *   `definition`: `string` (e.g., "A sense of achievement and success.")

*   **3.2. `CanvasCard` Type:**
    *   `instanceId`: `string` (A unique identifier for this specific instance on the canvas, e.g., `value-accomplishment-1668203948`)
    *   `value`: `Value` (The base value object)
    *   `position`: `{ x: number, y: number }` (The card's coordinates on the canvas)
    *   `size`: `{ width: number, height: number }` (The card's dimensions)
    *   `isCore`: `boolean` (To retain its original color)

### **4.0 Core Component Library: Detailed Specifications**

*   **4.1. `PageLayout` Component**
    *   **Purpose:** To provide the master structural frame for every screen.
    *   **Structure:** Renders three non-overlapping regions in this vertical order: `Header`, `Content`, `Footer`.
    *   **Styling:** Applies consistent, application-wide padding to the container.

*   **4.2. `InstructionsPanel` Component**
    *   **Purpose:** To display contextual instructions for each round.
    *   **Props:** `title: string`, `children: React.ReactNode`.
    *   **Presentation:** A container with a visually distinct background, a `title` element, and a `body` element for the descriptive text (`children`).

*   **4.3. `ValueCard` Component**
    *   **Purpose:** The visual representation of a single `Value`.
    *   **Props:** `value: Value`, `isDragging: boolean`, `color: string`.
    *   **Presentation:**
        *   Fixed width of 150px. Rounded corners of 8px. A box-shadow of `0 2px 4px rgba(0,0,0,0.1)`.
        *   Background color is determined by the `color` prop (defaults to `white`).
        *   When `isDragging` is `true`, the box-shadow **must** become more prominent (`0 5px 15px rgba(0,0,0,0.2)`) and the card **must** have a slight rotation transform applied (`transform: rotate(3deg)`).

*   **4.4. `ValueBank` Component**
    *   **Purpose:** A container for a list of draggable values.
    *   **Props:** `title: string`, `values: Value[]`, `droppableId: string`.
    *   **Presentation:**
        *   Fixed width of 300px. Full content-area height. Vertical scroll on overflow.
        *   The card list area **must** use Flexbox with `flex-wrap: wrap` and `align-content: flex-start` to ensure cards fill the space horizontally before wrapping.
        *   When a drag is in progress and the cursor is over this component's drop zone, its background color **must** change.

*   **4.5. `FreeCanvas` Component**
    *   **Purpose:** A "whiteboard" for unconstrained placement of values.
    *   **Props:** `values: CanvasCard[]`, `onCardMove: (instanceId, newPosition) => void`.
    *   **Behavior:**
        *   **Rendering:** Renders each `CanvasCard` from the `values` prop at its specified `position`.
        *   **Dragging:** When a card is dragged, it calls `onCardMove` with its `instanceId` and new `{x, y}` coordinates.
        *   **Z-Index:** A card being actively dragged **must** have a `z-index` of `1000`. All other cards have a `z-index` of `1`.
        *   **Zoom/Pan:** The entire canvas area **must** be wrapped in a zoom/pan component.

*   **4.6. `ValueSlot` Component**
    *   **Purpose:** A container for a single, final-choice value.
    *   **Props:** `value: Value | null`, `droppableId: string`, `placeholderText: string`.
    *   **Presentation:** Fixed size of 170px width by 120px height. Displays `placeholderText` when `value` is `null`.
    *   **Behavior:** See Section 5.3.3 for detailed drop logic.

*   **4.7. `Button` Component:**
    *   **Purpose:** A standard clickable element.
    *   **Props:** `onClick: () => void`, `disabled: boolean`, `children: React.ReactNode`.
    *   **Presentation:** **Must** have visually distinct styles for `default`, `hover`, and `disabled` states.

### **5.0 Application Flow & Round Specifications: Exhaustive Detail**

*   **5.1. Welcome Screen**
    *   **Layout:** `PageLayout` renders an `InstructionsPanel` and a `Button` labeled "Begin".
    *   **Navigation:** Clicking "Begin" clears any existing session data and transitions to Round 1.

*   **5.2. Round 1: The Values Sort**
    *   **State:** Manages four lists of `Value` objects: `bank`, `mostImportant`, `somewhatImportant`, `notImportant`.
    *   **Layout:**
        1.  `InstructionsPanel` with Round 1 text.
        2.  `ValueBank` on the left, rendered with the `bank` list.
        3.  Three drop-zone containers on the right, each containing a list of `ValueCards` from their respective state lists.
    *   **Interaction Logic:**
        *   A drag-and-drop context governs the `ValueBank` and the three bins.
        *   On drop, the card is removed from its source list and added to its destination list. The destination list is then re-sorted alphabetically.
    *   **Navigation:**
        *   A "Next Round" `Button` is present. Its `disabled` prop is `true` if `bank.length > 0`.
        *   On click, the `mostImportant` list is passed to Round 2.

*   **5.3. Round 2: Winnowing to Core Values**
    *   **State:** Manages four lists: `bankValues`, `canvasValues: CanvasCard[]`, `topTenSlots: (Value | null)[]`, `additionalSlots: (Value | null)[]`.
    *   **Layout:**
        1.  `InstructionsPanel` with Round 2 text.
        2.  `ValueBank` on the left, populated from the previous round.
        3.  `FreeCanvas` in the main area.
        4.  Two horizontally scrollable rows of 10 `ValueSlots` each.
    *   **Interaction Logic:**
        *   **5.3.1. Drag from Bank:** When a card is dragged from the `ValueBank`, a single, unified `onDrop` handler is triggered.
        *   **5.3.2. Drag from Canvas:** When a card is dragged from the `FreeCanvas`, the same `onDrop` handler is triggered.
        *   **5.3.3. `onDrop` Handler Logic:**
            1.  Check if the drop coordinates overlap with any *empty* `ValueSlot` in the "Top 10" row. If yes, populate that slot with the `Value`, remove the card from its source (`bankValues` or `canvasValues`), and stop.
            2.  If not, check if the drop coordinates overlap with any *empty* `ValueSlot` in the "Candidates" row. If yes, populate that slot, remove the card from its source, and stop.
            3.  If not, check if the drop coordinates are within the bounds of the `FreeCanvas`. If yes, and the source was the `bank`, remove the card from the `bank` and add a new `CanvasCard` to the `canvasValues` list. If the source was the `canvas`, update the `position` of the corresponding `CanvasCard`. Stop.
            4.  If none of the above, the drop is invalid. Do nothing (the card will animate back to its origin).
        *   **5.3.4. Eject from Slot:** A card can be dragged from a `ValueSlot`. The `onDrop` handler logic will place it correctly in another empty slot or on the canvas, and the source slot will be emptied.
    *   **Navigation:**
        *   "Next Round" `Button` is disabled if `topTenSlots.includes(null)`.
        *   On click, `topTenSlots` and `additionalSlots` are passed to Round 3.

*   **5.4. Round 3: The Value Map**
    *   **State:** Manages three lists: `coreValues: Value[]`, `additionalValues: Value[]`, `mappedValues: CanvasCard[]`.
    *   **Layout:**
        1.  `InstructionsPanel` with Round 3 text.
        2.  A `ValueBank` with two non-droppable sections displaying `coreValues` (white background) and `additionalValues` (light blue background).
        3.  A `FreeCanvas`.
    *   **Interaction Logic:**
        *   **5.4.1. Drag to Canvas:** Dragging a card from *either* list in the bank creates a **copy** as a new `CanvasCard` on the `FreeCanvas`. The bank is not modified.
        *   **5.4.2. Resizing:** Cards on the canvas **must** be resizable. When a resize is complete, the `size` property of the corresponding `CanvasCard` in `mappedValues` is updated.
        *   **5.4.3. Swapping:** A drag-and-drop context governs only the two lists within the bank. If a card from `additionalValues` is dropped onto `coreValues`, their positions in the respective arrays are swapped.
    *   **Navigation:** "Finish" `Button` transitions to the Results Screen.

*   **5.5. Results Screen**
    *   **Layout:** `PageLayout` with a title, a static, non-interactive rendering of the `FreeCanvas` from Round 3, and two `Buttons`.
    *   **Interaction Logic:**
        *   "Export as Image" `Button` **must** trigger a browser download of the canvas area as a PNG file.
        *   "Start Over" `Button` **must** trigger a confirmation dialog. If confirmed, it clears the session storage and navigates to the Welcome Screen.
    
### **6.0 Architectural & Procedural Framework: The Values Alignment Game**

    The proposed architecture is for a purely client-side Single Page Application (SPA). The stack is chosen for its performance, strong typing, component-driven nature, and ease of deployment. The processes are designed to ensure high code quality and predictable, automated workflows from development to deployment. We will explicitly avoid backend infrastructure in this phase, as all requirements, including session persistence, can be handled securely and efficiently on the client.

### **6.1 Core Frontend Stack**

    This is the foundation upon which the application will be built.

*   **6.1.1 Build Tool & Development Environment: Vite**
    *   **Reasoning:** Vite offers a significantly faster development experience (near-instant Hot Module Replacement) compared to older tools like Create React App. Its configuration is simpler and its production builds are highly optimized. For a client-side SPA, it is the modern standard.
    *   **Implementation:** The project will be initialized using `npm create vite@latest -- --template react-ts`.

*   **6.1.2 UI Framework: React 18**
    *   **Reasoning:** React's component model is a perfect match for the project's architecture. Its vast ecosystem provides mature libraries for every required feature. We will use React 18 to leverage its concurrent features and hooks.

*   **6.1.3 Language: TypeScript**
    *   **Reasoning:** Non-negotiable for professional development. It ensures type safety, dramatically reduces runtime errors, and serves as living documentation for our data structures and component APIs.

*   **6.1.4 State Management: React Context with `useReducer`**
    *   **Reasoning:** For an application of this complexity, a full-scale state management library like Redux or Zustand is premature optimization. React's built-in Context API, combined with the `useReducer` hook, provides a robust, predictable, and sufficient pattern for managing the application's state (current round, card positions, etc.) without adding external dependencies.
    *   **Implementation:** A single `GameContext` will be created to provide state and dispatch functions to the entire component tree.

*   **6.1.5 Styling: `styled-components`**
    *   **Reasoning:** This library allows for true component-level styling, encapsulating CSS within the component file itself. This prevents style leakage, promotes reusability, and makes it easy to create dynamic styles based on component props (e.g., the `isDragging` state of a `ValueCard`).

### **6.2 Interaction & Feature Libraries**

These are specialized tools chosen for specific, complex UI requirements.

*   **6.2.1 List-Based Drag & Drop (Round 1, Round 3 Sidebar): `dnd-kit`**
    *   **Reasoning:** While `react-beautiful-dnd` is excellent, `dnd-kit` is a more modern, performant, and flexible toolkit. It is unopinionated, highly customizable, and has first-class support for accessibility. It is the superior choice for a new project.

*   **6.2.2 Free-Form Drag & Drop (Rounds 2 & 3 Canvas): `react-draggable`**
    *   **Reasoning:** This library does one thing perfectly: unconstrained X/Y axis dragging. It is lightweight and simple to implement for the "Miro-style" canvas, where we only care about position, not sorting or list logic.

*   **6.2.3 Canvas Zoom/Pan (Rounds 2 & 3 Canvas): `react-zoom-pan-pinch`**
    *   **Reasoning:** A lightweight and powerful library that provides smooth zoom and pan functionality out of the box. It is the ideal tool for the `FreeCanvas` component.

*   **6.2.4 Export to Image (Results Screen): `html-to-image`**
    *   **Reasoning:** A modern, well-maintained library that can convert a DOM node (our final Value Map) into an image file directly on the client-side, requiring no server interaction.

### **6.3 Backend & Data Persistence**

*   **6.3.1 Backend Server: None**
    *   **Reasoning:** The project specification has no requirement for user accounts, multi-user collaboration, or centralized data storage. Building a backend would be a significant and unnecessary expense in terms of development and operational overhead.

*   **6.3.2 Database: None**
    *   **Reasoning:** All application data is ephemeral or session-based.

*   **6.3.3 Session Persistence: Browser `localStorage`**
    *   **Reasoning:** `localStorage` is a simple, universally supported browser API perfect for meeting the session persistence requirement. The entire application state object can be serialized to a JSON string and saved after every action, and rehydrated on page load.

### **6.4 Development Lifecycle & Quality Assurance**

*   **6.4.1 Version Control: Git & GitHub**
    *   **Procedure:** All code will be hosted in a GitHub repository. Development will follow the **Git Flow** model (i.e., `main` branch for production, `develop` branch for integration, and feature branches for new work). All new work must be submitted via Pull Requests to the `develop` branch.

*   **6.4.2 Code Quality: ESLint & Prettier with Pre-commit Hooks**
    *   **Procedure:** The project will be configured with strict ESLint rules (e.g., Airbnb's style guide) and Prettier for automated code formatting. A pre-commit hook (using `husky` and `lint-staged`) will be implemented. This hook will automatically lint and format any staged files before a commit is allowed, ensuring no poorly formatted or low-quality code ever enters the repository.

*   **6.4.3 Testing Strategy: A Multi-Layered Approach**
    *   **6.4.3.1 Unit & Component Testing: Vitest + React Testing Library**
        *   **Reasoning:** Vitest is a modern test runner designed for Vite, making it incredibly fast. React Testing Library is the standard for testing components from a user's perspective.
        *   **Procedure:** All components **must** have corresponding test files. Tests will focus on behavior: "Given these props, does the component render correctly?" and "When the user clicks this button, is the correct function called?". We do not test implementation details.
    *   **6.4.3.2 End-to-End (E2E) Testing: Cypress**
        *   **Reasoning:** Cypress allows us to write tests that simulate a real user's entire journey through the application.
        *   **Procedure:** A suite of E2E tests will be created to cover the critical paths:
            1.  Completing Round 1 and verifying the correct data is passed to Round 2.
            2.  Dragging a card from the bank to a slot in Round 2.
            3.  Successfully completing the game and reaching the Results Screen.

*   **6.4.4 Continuous Integration & Deployment (CI/CD): GitHub Actions**
    *   **Procedure:** A CI/CD workflow will be defined in a `.github/workflows/main.yml` file. This workflow will trigger on every push to the `main` and `develop` branches and will automatically:
        1.  **Install Dependencies:** `npm install`
        2.  **Lint:** `npm run lint`
        3.  **Test:** `npm run test` (runs all Vitest and Cypress tests)
        4.  **Build:** `npm run build`
        5.  **Deploy:** (On push to `main` only) Automatically deploy the contents of the `dist` folder to our hosting provider.
    *   A Pull Request **cannot** be merged unless all these checks pass.

### **6.5 Deployment & Hosting**

*   **6.5.1 Platform: Netlify**
    *   **Reasoning:** Netlify is a best-in-class platform for deploying modern frontend applications. It offers a generous free tier, seamless integration with GitHub, a global CDN for fast load times, and automatic deployments triggered by our CI/CD workflow. It is the most efficient and cost-effective solution for this project.

### **7.0 UI/UX Design Outline: The Values Alignment Game**

### **7.1. Visual Identity & Design System**

This system defines the look and feel of the entire application, ensuring consistency and a cohesive aesthetic.

*   **7.1.1. Color Palette:**
    *   **Primary Action (`#007AFF`):** A clear, accessible blue. Used for all primary buttons, active links, and key interaction highlights.
    *   **Neutral Background (`#F8F9FA`):** A very light, warm gray. Used for the main page background and component backgrounds like the `ValueBank` to create a soft, non-distracting canvas.
    *   **Interactive Surface (`#FFFFFF`):** Pure white. Used for the `ValueCard` and the `FreeCanvas` to make them feel like primary, tangible objects.
    *   **Text (`#212529`):** A near-black, dark gray. Provides strong, readable contrast without the harshness of pure black.
    *   **Subtle Borders/Dividers (`#DEE2E6`):** A light gray used for borders and dividers to create structure without being visually jarring.
    *   **Secondary Accent (`#E6F7FF`):** A very light, muted blue. Used for the "Additional Candidate" cards in Round 3 to create a clear visual distinction from core values.
    *   **Interaction Feedback (`#D4EDDA`):** A soft green for success states (e.g., a saved confirmation).

*   **7.1.2. Typography:**
    *   **Headings (`'Inter', sans-serif`):** A modern, clean, and highly readable sans-serif font. Used for all titles and major headings. Font weight: `600` (Semibold).
    *   **Body Text (`'Inter', sans-serif`):** Used for all instructions, definitions, and button text. Font weight: `400` (Regular).
    *   **Hierarchy:** A clear typographic scale will be used to establish visual hierarchy (e.g., H1: 32px, H2: 24px, H3: 20px, Body: 16px).

*   **7.1.3. Spacing & Layout:**
    *   **Grid System:** A consistent 8px grid system will be used for all padding, margins, and component spacing. This ensures a harmonious and predictable layout. (e.g., padding: 16px, gap: 24px).
    *   **Whitespace:** Generous use of whitespace is critical to reduce cognitive load and create a calm, focused experience.

*   **7.1.4. Iconography:**
    *   Minimalist and universally understood icons will be used sparingly. For example, a subtle "resize" handle on the corner of a resizable card. Icons should be in a consistent line-art style.

### **7.2. Core Component UX Design**

This section details the specific user experience and micro-interactions for each component.

*   **7.2.1. `ValueCard` UX:**
    *   **Resting State:** Displays the value name and definition with a subtle box-shadow (`2px 2px 5px rgba(0,0,0,0.05)`).
    *   **Hover State:** The box-shadow becomes slightly more pronounced (`4px 4px 10px rgba(0,0,0,0.08)`), and the cursor changes to a "grab" hand, signaling interactivity.
    *   **Drag State ("Lift" Animation):** On mouse-down, the card should instantly scale up slightly (`transform: scale(1.05)`), the shadow becomes prominent, and the cursor changes to a "grabbing" hand. This provides tangible feedback that the user has "picked up" the object.

*   **7.2.2. `FreeCanvas` UX:**
    *   **Interaction Model:** The canvas should feel like an infinite space.
    *   **Zoom:** Zooming (via mouse wheel or trackpad pinch) should be centered on the cursor's position, allowing the user to intuitively zoom into specific areas of their map.
    *   **Pan:** Panning (via click-and-drag on the canvas background) should change the cursor to a "move" or "grabbing" icon.

*   **7.2.3. `ValueSlot` UX:**
    *   **Empty State:** Displays the placeholder text in a light, italicized font.
    *   **Hover-Over State (with a dragged card):** The border of the slot **must** change to the Primary Action color (`#007AFF`) and adopt a dashed style (`border: 2px dashed #007AFF`). This clearly communicates "This is a valid drop target."
    *   **Filled State:** The card sits neatly inside the slot. There is no hover effect on the slot itself when filled.

### **7.3. Screen-by-Screen User Journey & Wireframes**

This describes the layout and flow of each screen in the application.

*   **7.3.1. Welcome Screen:**
    *   **Layout:** Centered on the page. A large, welcoming `H1` title ("Discover Your Core Values"). Below it, the `InstructionsPanel` provides a 2-3 sentence overview of the game. Below that, a single, primary `Button` labeled "Begin Your Journey".

*   **7.3.2. Round 1: The Values Sort:**
    *   **Layout:** A three-column layout.
        *   **Column 1 (Fixed Width):** The `ValueBank`.
        *   **Columns 2, 3, 4 (Flexible Width):** The three category bins ("Matters most," "Matters somewhat," "Doesn't matter"). These bins should have equal width and grow to fill the available space.
    *   **Flow:** As the user drags cards from the bank, the bank empties. The category bins fill up, with cards wrapping neatly inside. The "Next Round" button in the footer remains disabled and grayed out until the bank is empty, at which point it turns into the primary action color.

*   **7.3.3. Round 2: Winnowing to Core Values:**
    *   **Layout:** A vertical-split layout.
        *   **Top Section:** The `InstructionsPanel`.
        *   **Middle Section (Main Area):** A two-column layout. The left column is the fixed-width `ValueBank`. The right, larger column is the `FreeCanvas`.
        *   **Bottom Section:** The two horizontally scrollable rows of `ValueSlots`. A subtle shadow or divider separates this section from the canvas above it.
    *   **Visual Cue:** When the user drags a card, both the canvas and all empty slots are valid targets. The canvas border and the borders of all empty slots should light up simultaneously to show the user all their options.

*   **7.3.4. Round 3: The Value Map:**
    *   **Layout:** A two-column layout.
        *   **Left Column (Fixed Width):** The `ValueBank`, now containing the two distinct, non-droppable "Core" and "Additional" lists. The visual separation (title and card background color) must be very clear.
        *   **Right Column (Main Area):** The `FreeCanvas`.
    *   **Interaction:** The experience is focused on the canvas. The sidebar is for reference and swapping. When a swap occurs in the sidebar, the change should be instant.

*   **7.3.5. Results Screen:**
    *   **Layout:** A presentation-focused screen.
        *   **Header:** A congratulatory title ("Your Personal Value Map").
        *   **Content:** The user's final value map is displayed in a static, non-interactive container that is centered on the page. It should be rendered at a size that fits well within the viewport.
        *   **Footer:** Two buttons, side-by-side: "Export as Image" (primary action style) and "Start Over" (secondary, outline style).
    *   **Confirmation Dialog:** Clicking "Start Over" **must** trigger a modal dialog (a pop-up that overlays the screen and disables interaction with the background). The modal will have a title ("Are you sure?"), descriptive text ("Starting over will permanently delete your current map."), and two buttons: "Cancel" and "Yes, Start Over". This prevents accidental data loss.

### **7.4. Animation & Motion Design**

Subtle animations are key to making the application feel alive and responsive.

*   **7.4.1. Transitions:** When navigating between rounds, the content should not just "pop" in. It should use a gentle fade-in and slide-up transition (`opacity: 0 -> 1`, `transform: translateY(10px) -> translateY(0)`).
*   **7.4.2. Card Drop:** When a card is dropped into a valid slot, it shouldn't just appear. It should animate smoothly from its drop position to its final, centered position within the slot.
*   **7.4.3. Layout Shifts:** All layout changes (e.g., a card being added to a list) should be animated smoothly using a library like `Framer Motion` or simple CSS transitions to prevent jarring reflows.

### **The Staged Prompt Sequence**

We will build the application in the same order a professional development team would: Foundation -> Components -> State -> Assembly.

### **8.0 Here is the sequence of prompts you will use:**

1.  **Prompt 1: Project Scaffolding & Core Dependencies**
2.  **Prompt 2: Core Component Construction (Stateless)**
3.  **Prompt 3: State Management & Data Structures**
4.  **Prompt 4: Assembling the Welcome Screen & Page Layout**
5.  **Prompt 5: Assembling Round 1**
6.  **Prompt 6: Assembling Round 2**
7.  **Prompt 7: Assembling Round 3**
8.  **Prompt 8: Assembling the Results Screen**
9.  **Prompt 9: Final Assembly of the Main App Router**