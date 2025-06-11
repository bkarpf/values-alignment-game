## **Project Specification: The Values Alignment Game (v5.0 - Post-Implementation Update)**

**Document Preamble:** This document (v5.0) supersedes all previous versions. It has been updated with critical lessons learned, architectural decisions, and refined implementation patterns discovered during the development of Round 2. This is the single source of truth for all current and future work.

### **1.0 Critical Lessons & Resolved Issues (The Project Memory)**

This section contains non-negotiable constraints and established patterns. These problems have been solved and must not be revisited.

*   **1.1. Unified Drag & Drop (D&D) Strategy**
    *   **Directive:** The project **must** use `dnd-kit` for **all** drag-and-drop operations, including list-based sorting (Round 1) and the free-form canvas (Rounds 2 & 3).
    *   **Reasoning:** Using a single D&D library provides a unified event model (`onDragStart`, `onDragEnd`), prevents library conflicts, and creates a more robust and maintainable architecture. The initial consideration of using `react-draggable` is now obsolete.

*   **1.2. Canvas Drop Implementation: A Hybrid Approach**
    *   **Problem:** The default collision detection in `dnd-kit` is insufficient for a "drop anywhere" canvas, as draggable items already on the canvas can obscure the drop zone.
    *   **Solution:** The `onDragEnd` handler **must** implement a hybrid strategy:
        1.  **Primary Check:** First, check if `dnd-kit`'s `over` property identifies a specific, named droppable (e.g., a `ValueSlot` or the `ValueBank`). If so, trust this result.
        2.  **Fallback Coordinate Check:** If `over` is `null`, a manual coordinate check **must** be performed. Get the canvas container's dimensions via a `ref` (`getBoundingClientRect()`) and the cursor's final position from the event. If the cursor is within the canvas bounds, it is a valid canvas drop.

*   **1.3. Canvas Coordinate Translation (Zoom/Pan)**
    *   **Problem:** When the canvas is zoomed or panned, drop coordinates relative to the viewport do not match the internal coordinates of the canvas content.
    *   **Solution:** To place an item correctly on a transformed canvas, its position **must** be translated.
        1.  Obtain a `ref` to the `react-zoom-pan-pinch` `TransformWrapper` instance.
        2.  From the instance's state, get the current `scale`, `positionX`, and `positionY`.
        3.  Apply the following formula in the `onDragEnd` handler:
            *   `internalX = (viewportDropX - canvasLeftEdge - panX) / scale`
            *   `internalY = (viewportDropY - canvasTopEdge - panY) / scale`

*   **1.4. D&D and Zoom/Pan Library Integration**
    *   **Problem:** The `react-zoom-pan-pinch` library can crash if its `excluded` prop receives an invalid CSS selector.
    *   **Solution:** When excluding draggable items from the panning functionality, provide an array of **class names only**, without the `.` prefix (e.g., `excluded={['dnd-draggable']}`).

*   **1.5. `CanvasCard` Initialization Defaults**
    *   **Resolved Ambiguity:** When a new `CanvasCard` is created by dragging from the `ValueBank` in Round 2, it **must** be initialized with these values:
        *   `size`: `{ width: 150, height: 100 }`
        *   `isCore`: `false`

### **2.0 Project Vision & Core Mandate**

This document specifies the design and behavior of The Values Alignment Game, an interactive web application that enables users to identify, clarify, and map their personal core values. The development team is mandated to build the application precisely as described herein, employing a technology stack that best serves these requirements. The user experience must be fluid, intuitive, and reflective.

### **3.0 Global System Requirements & Architecture**

*   **3.1. Architecture: Component-Driven & State-Managed**
    *   The application **must** be built using a component-driven architecture. The components specified in Section 5.0 are the definitive building blocks.
    *   Application state (the current round, the contents of all containers, the position of all cards, etc.) **must** be managed in a centralized, predictable, and unidirectional data flow.

*   **3.2. Core Requirement: Session Persistence**
    *   The entire application state **must** be automatically saved to the user's local browser storage (`localStorage` is sufficient) after every state-changing action (e.g., a card drop, a navigation event).
    *   Upon application load (including a browser refresh), the system **must** first check for a saved session. If one exists, the application **must** rehydrate itself to that exact saved state. If no session exists, it **must** load to the Welcome Screen.

*   **3.3. Core Requirement: Accessibility (A11y)**
    *   All interactive elements (buttons, cards, navigation) **must** be keyboard-navigable (i.e., using `Tab` and `Enter`/`Space`).
    *   All interactive elements **must** have clear `focus` states (e.g., a visible outline).
    *   All non-textual UI elements (e.g., icons, if any) **must** have appropriate ARIA labels.
    *   Color contrast ratios **must** meet WCAG AA standards.

*   **3.4. Development Environment**
    *   The codebase **must** be written in TypeScript. All data structures, props, and functions **must** be explicitly typed.
    *   A pre-configured linter and code formatter **must** be used to enforce code quality and consistency.
    *   A debug navigation UI **must** be implemented that allows direct navigation to any round. This UI **must** be excluded from production builds via an environment variable.

### **4.0 Data Structures**

*   **4.1. `Value` Type:**
    *   `id`: `string` (A unique identifier, e.g., "value-accomplishment")
    *   `name`: `string` (e.g., "Accomplishment")
    *   `definition`: `string` (e.g., "A sense of achievement and success.")

*   **4.2. `CanvasCard` Type:**
    *   `instanceId`: `string` (A unique identifier for this specific instance on the canvas, e.g., `value-accomplishment-1668203948`)
    *   `value`: `Value` (The base value object)
    *   `position`: `{ x: number, y: number }` (The card's coordinates on the canvas)
    *   `size`: `{ width: number, height: number }` (The card's dimensions)
    *   `isCore`: `boolean` (To retain its original color)

### **5.0 Core Component Library: Detailed Specifications**

*   **5.1. `PageLayout` Component**
    *   **Purpose:** To provide the master structural frame for every screen.
    *   **Structure:** Renders three non-overlapping regions in this vertical order: `Header`, `Content`, `Footer`.
    *   **Styling:** Applies consistent, application-wide padding to the container.

*   **5.2. `InstructionsPanel` Component**
    *   **Purpose:** To display contextual instructions for each round.
    *   **Props:** `title: string`, `children: React.ReactNode`.
    *   **Presentation:** A container with a visually distinct background, a `title` element, and a `body` element for the descriptive text (`children`).

*   **5.3. `ValueCard` Component**
    *   **Purpose:** The visual representation of a single `Value`.
    *   **Props:** `value: Value`, `isDragging: boolean`, `color: string`.
    *   **Presentation:**
        *   Fixed width of 150px. Rounded corners of 8px. A box-shadow of `0 2px 4px rgba(0,0,0,0.1)`.
        *   Background color is determined by the `color` prop (defaults to `white`).
        *   When `isDragging` is `true`, the box-shadow **must** become more prominent (`0 5px 15px rgba(0,0,0,0.2)`) and the card **must** have a slight rotation transform applied (`transform: rotate(3deg)`).
    *   **Color Mapping:** The `isCore` boolean from a `CanvasCard` is mapped to the `color` prop. `isCore: true` maps to `#FFFFFF` (Interactive Surface), `isCore: false` maps to `#E6F7FF` (Secondary Accent).

*   **5.4. `ValueBank` Component**
    *   **Purpose:** A container for a list of draggable values.
    *   **Props:** `title: string`, `values: Value[]`, `droppableId: string`.
    *   **Presentation:**
        *   Fixed width of 300px. Full content-area height. Vertical scroll on overflow.
        *   The card list area **must** use Flexbox with `flex-wrap: wrap` and `align-content: flex-start` to ensure cards fill the space horizontally before wrapping.
        *   When a drag is in progress and the cursor is over this component's drop zone, its background color **must** change.

*   **5.5. `FreeCanvas` Component**
    *   **Purpose:** To provide a zoomable, pannable container for its children.
    *   **Props:** `children: React.ReactNode`, and it **must** accept a `ref` passed via `React.forwardRef`.
    *   **Behavior:**
        *   This component **does not** handle any drag-and-drop logic itself.
        *   It wraps its `children` in a `<TransformWrapper>` from `react-zoom-pan-pinch`.
        *   The parent component (`Round2.tsx`, `Round3.tsx`) is responsible for rendering draggable items *inside* the `FreeCanvas`.

*   **5.6. `ValueSlot` Component**
    *   **Purpose:** A container for a single, final-choice value.
    *   **Props:** `value: Value | null`, `droppableId: string`, `placeholderText: string`.
    *   **Presentation:** Fixed size of 170px width by 120px height. Displays `placeholderText` when `value` is `null`.
    *   **Behavior:** See Section 6.2 for detailed drop logic.

*   **5.7. `Button` Component:**
    *   **Purpose:** A standard clickable element.
    *   **Props:** `onClick: () => void`, `disabled: boolean`, `children: React.ReactNode`.
    *   **Presentation:** **Must** have visually distinct styles for `default`, `hover`, and `disabled` states.

### **6.0 Application Flow & Round Specifications: Exhaustive Detail**

*   **6.1. Welcome Screen & Round 1**
    *   **Welcome Screen Layout:** `PageLayout` renders an `InstructionsPanel` and a `Button` labeled "Begin".
    *   **Welcome Screen Navigation:** Clicking "Begin" clears any existing session data and transitions to Round 1.
    *   **Round 1 State:** Manages four lists of `Value` objects: `bank`, `mostImportant`, `somewhatImportant`, `notImportant`.
    *   **Round 1 Layout:** A three-column layout with the `ValueBank` on the left and three drop-zone containers on the right.
    *   **Round 1 Interaction:** A `dnd-kit` context governs dragging cards from the bank to the bins. On drop, the card is moved and the destination list is sorted alphabetically.
    *   **Round 1 Navigation:** A "Next Round" `Button` is enabled only when `bank.length === 0`. On click, the `mostImportant` list is passed to Round 2.

*   **6.2. Round 2: Winnowing to Core Values**
    *   **State:** Manages `bank: Value[]`, `canvas: CanvasCard[]`, `topTenSlots: (Value | null)[]`, `additionalSlots: (Value | null)[]`.
    *   **Layout:** A two-row layout.
        1.  **Top Area:** A flexible-height row containing the `ValueBank` (fixed width) on the left and the `FreeCanvas` (flexible width) on the right.
        2.  **Bottom Area:** A fixed-height `SlotsSection` below the `TopArea`, containing two horizontally scrollable rows of `ValueSlots`.
    *   **Interaction Logic (`onDragEnd` Handler):**
        1.  The handler first checks if `dnd-kit`'s `over` property identifies a specific droppable (`ValueSlot` or `ValueBank`). If so, it dispatches the corresponding action.
        2.  **If `over` is `null`**, the handler performs a manual coordinate check to determine if the drop occurred within the bounds of the `FreeCanvas` container.
        3.  If the drop is on the canvas, the handler **must** get the current `scale` and pan state from the `FreeCanvas`'s `TransformWrapper` `ref` and translate the viewport coordinates to the canvas's internal coordinates before dispatching the `PLACE_ON_CANVAS_R2` action.
    *   **Card Initialization:** When a card is dragged from the bank to the canvas, a new `CanvasCard` is created with `size: { width: 150, height: 100 }` and `isCore: false`.
    *   **Navigation:** "Next Round" `Button` is disabled if `topTenSlots.includes(null)`. On click, `topTenSlots` and `additionalSlots` are passed to Round 3.

*   **6.3. Round 3: The Value Map**
    *   **State:** Manages three lists: `coreValues: Value[]`, `additionalValues: Value[]`, `mappedValues: CanvasCard[]`.
    *   **Layout:**
        1.  `InstructionsPanel` with Round 3 text.
        2.  A `ValueBank` with two non-droppable sections displaying `coreValues` (white background) and `additionalValues` (light blue background).
        3.  A `FreeCanvas`.
    *   **Interaction Logic:**
        *   **Drag to Canvas:** Dragging a card from *either* list in the bank creates a **copy** as a new `CanvasCard` on the `FreeCanvas`. The bank is not modified.
        *   **Resizing:** Cards on the canvas **must** be resizable. When a resize is complete, the `size` property of the corresponding `CanvasCard` in `mappedValues` is updated.
        *   **Swapping:** A drag-and-drop context governs only the two lists within the bank. If a card from `additionalValues` is dropped onto `coreValues`, their positions in the respective arrays are swapped.
    *   **Navigation:** "Finish" `Button` transitions to the Results Screen.

*   **6.4. Results Screen**
    *   **Layout:** `PageLayout` with a title, a static, non-interactive rendering of the `FreeCanvas` from Round 3, and two `Buttons`.
    *   **Interaction Logic:**
        *   "Export as Image" `Button` **must** trigger a browser download of the canvas area as a PNG file.
        *   "Start Over" `Button` **must** trigger a confirmation dialog. If confirmed, it clears the session storage and navigates to the Welcome Screen.

### **7.0 Architectural & Procedural Framework**

*   **7.1. Core Frontend Stack**
    *   **Build Tool & Development Environment: Vite:** Chosen for its fast development experience and optimized builds.
    *   **UI Framework: React 18:** Chosen for its component model and modern features.
    *   **Language: TypeScript:** Non-negotiable for type safety and code quality.
    *   **State Management: React Context with `useReducer`:** Provides robust state management without external dependencies.
    *   **Styling: `styled-components`:** Enables encapsulated, prop-driven component styling.

*   **7.2. Interaction & Feature Libraries**
    *   **Unified Drag & Drop: `dnd-kit`:** `dnd-kit` is the **sole** library for all drag-and-drop interactions. This provides a unified event model and avoids library conflicts. The use of any other D&D library (like `react-draggable`) is forbidden.
    *   **Canvas Zoom/Pan: `react-zoom-pan-pinch`:** A lightweight and powerful library for the zoom/pan requirement. It **must** be configured to exclude draggable elements (e.g., via `excluded: ['dnd-draggable']`) from its panning logic to prevent conflicts.
    *   **Export to Image: `html-to-image`:** A modern, client-side library for converting a DOM node to an image file.

*   **7.3. Backend & Data Persistence**
    *   **Backend Server: None:** The application is purely client-side.
    *   **Database: None:** All data is session-based.
    *   **Session Persistence: Browser `localStorage`:** The entire application state object is serialized to JSON and saved/rehydrated from `localStorage`.

*   **7.4. Development Lifecycle & Quality Assurance**
    *   **Version Control: Git & GitHub:** Using the Git Flow model (main, develop, feature branches).
    *   **Code Quality: ESLint & Prettier with Pre-commit Hooks:** Enforces code quality and formatting automatically before commits.
    *   **Testing Strategy: Vitest + React Testing Library (Unit/Component), Cypress (E2E):** A multi-layered approach to ensure behavioral correctness.
    *   **Continuous Integration & Deployment (CI/CD): GitHub Actions:** Automates linting, testing, building, and deployment on pushes to `main` and `develop`.

*   **7.5. Deployment & Hosting**
    *   **Platform: Netlify:** Chosen for its seamless GitHub integration, global CDN, and automatic deployments.

### **8.0 UI/UX Design Outline**

*   **8.1. Visual Identity & Design System**
    *   **Color Palette:** Defines primary, neutral, accent, and feedback colors.
    *   **Typography:** Uses 'Inter' for headings and body text with a clear typographic scale.
    *   **Spacing & Layout:** Based on a consistent 8px grid system.
    *   **Iconography:** Minimalist and used sparingly.

*   **8.2. Core Component UX Design**
    *   **`ValueCard` UX:** Defines resting, hover, and drag states with distinct visual feedback (shadow, transform).
    *   **`FreeCanvas` UX:** The canvas should feel infinite, with intuitive zoom (mouse wheel/pinch) and pan (click-drag on background) interactions.
    *   **`ValueSlot` UX:** Defines empty, hover-over (dashed border), and filled states.

*   **8.3. Screen-by-Screen User Journey & Wireframes**
    *   **Welcome Screen:** Centered layout with a title, instructions, and a single "Begin" button.
    *   **Round 1: The Values Sort:** A three-column layout with the `ValueBank` on the left and three category bins on the right.
    *   **Round 2: Winnowing to Core Values:** A two-row structure. The top, main area contains the `ValueBank` on the left and the `FreeCanvas` on the right. The bottom area, spanning the full width below the top area, contains the two horizontally scrollable rows of `ValueSlots`.
    *   **Round 3: The Value Map:** A two-column layout with the `ValueBank` (containing two non-droppable lists) on the left and the `FreeCanvas` on the right.
    *   **Results Screen:** A presentation-focused screen with a title, the static final map, and "Export" / "Start Over" buttons. A confirmation modal is required for "Start Over".

*   **8.4. Animation & Motion Design**
    *   **Transitions:** Gentle fade-in and slide-up transitions between rounds.
    *   **Card Drop:** Smooth animation for a card settling into a valid slot.
    *   **Layout Shifts:** Animated to prevent jarring reflows.

### **9.0 The Staged Prompt Sequence**

We will build the application in the same order a professional development team would: Foundation -> Components -> State -> Assembly.

*   **Prompt 1: Project Scaffolding & Core Dependencies**
*   **Prompt 2: Core Component Construction (Stateless)**
*   **Prompt 3: State Management & Data Structures**
*   **Prompt 4: Assembling the Welcome Screen & Page Layout**
*   **Prompt 5: Assembling Round 1**
*   **Prompt 6: Assembling Round 2**
*   **Prompt 7: Assembling Round 3**
*   **Prompt 8: Assembling the Results Screen**
*   **Prompt 9: Final Assembly of the Main App Router**