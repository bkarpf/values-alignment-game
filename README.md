# The Values Alignment Game

An interactive web application designed to help users discover, prioritize, and map their personal core values through a guided, multi-round experience.

<!-- Optional: Add a GIF of the application in action here. It's the best way to showcase the project. -->
<!-- ![Values Alignment Game Demo](./docs/demo.gif) -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-blue?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tests-Passing-brightgreen?logo=vitest" alt="Tests">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
</p>

---

## Table of Contents

- [About The Project](#about-the-project)
  - [Core Features](#core-features)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Development Server](#running-the-development-server)
  - [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## About The Project

The Values Alignment Game is a purely client-side Single Page Application (SPA) that provides a seamless, reflective user experience without the need for a backend or user accounts. It guides users through a three-round process:

1.  **Round 1: The Values Sort** - Users sort a master list of values into three categories of personal importance.
2.  **Round 2: Winnowing to Core Values** - Users use a "Miro-style" canvas to narrow down their choices to a Top 10 list and a secondary list of candidates.
3.  **Round 3: The Value Map** - Users create a visual, contextual map of their core values, arranging and resizing them in a way that is personally meaningful.

The application state is automatically saved to the browser's local storage, so users can refresh the page and resume their progress at any time.

### Core Features

-   **Component-Driven Architecture:** Built with a library of reusable, well-defined components.
-   **Hybrid Drag & Drop System:** Utilizes the best tool for each job: `dnd-kit` for accessible, list-based interactions and `react-draggable` for unconstrained canvas placement.
-   **Interactive Canvas:** A "Miro-style" canvas with zoom, pan, and resize capabilities.
-   **Session Persistence:** Automatically saves your progress in the browser.
-   **Image Export:** Allows users to download their final Value Map as a PNG image.

### Built With

This project leverages a modern, performant, and type-safe frontend stack.

-   **[Vite](https://vitejs.dev/)** - Build Tool & Development Environment
-   **[React 18](https://reactjs.org/)** - UI Framework
-   **[TypeScript](https://www.typescriptlang.org/)** - Language
-   **[Styled Components](https://styled-components.com/)** - CSS-in-JS Styling
-   **[dnd-kit](https://dndkit.com/)** - List-Based Drag & Drop
-   **[React Draggable](https://github.com/react-grid-layout/react-draggable)** - Canvas Drag & Drop
-   **[React Zoom Pan Pinch](https://github.com/prc5/react-zoom-pan-pinch)** - Canvas Zoom/Pan
-   **[html-to-image](https://github.com/bubkoo/html-to-image)** - Export to Image
-   **[Vitest](https://vitest.dev/)** - Unit & Component Testing
-   **[Cypress](https://www.cypress.io/)** - End-to-End Testing

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You must have Node.js (version 18.x or later) and a package manager like `npm` or `yarn` installed on your machine.

-   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/your_username/value-finder.git
    ```
2.  **Navigate into the project directory**
    ```sh
    cd value-finder
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```

---

## Usage

### Running the Development Server

To run the app in development mode with hot-reloading:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view it in the browser.

### Running Tests

This project uses Vitest for unit/component tests and Cypress for end-to-end tests.

-   **To run unit tests in watch mode:**
    ```sh
    npm test
    ```
-   **To open the Cypress test runner for E2E tests:**
    ```sh
    npm run cypress:open
    ```

---

## Project Structure

The application follows a standard component-driven structure to ensure a clear separation of concerns.

```
/src
|-- /components/    # Reusable, stateless UI components (Button, ValueCard, etc.)
|-- /context/       # React Context for global state management (GameContext)
|-- /hooks/         # Custom React hooks (if any)
|-- /pages/         # Page-level components that assemble the UI for each round
|-- /types/         # TypeScript type definitions (Value, CanvasCard, etc.)
|-- /utils/         # Utility functions (e.g., helper functions)
|-- App.tsx         # Main application component, router
|-- main.tsx        # Application entry point```

---

## Roadmap

-   [ ] **Feature: Draw Arrows** - Implement the ability for users to draw, style, and save connectors between value cards on the Round 3 canvas.
-   [ ] **Enhancement: Theming** - Add a dark mode and potentially other color themes.
-   [ ] **Testing:** Increase test coverage for edge cases and complex interactions.

See the [open issues](https://github.com/your_username/value-finder/issues) for a full list of proposed features (and known issues).

---

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/brandonhedy/values-alignment-game](https://github.com/brandonhedy/values-alignment-game)
```