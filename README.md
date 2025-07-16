# Flow Designer

A visual flow editor for designing, editing, and managing complex workflows. Built with React, TypeScript, Redux, Ant Design, and [@xyflow/react](https://xyflow.dev/) for interactive node-based editing. Supports advanced data mapping and transformation using [JSONata](https://jsonata.org/).

## Features

- **Visual Flow Editing**: Drag-and-drop node-based interface for building workflows.
- **Custom Node Types**: Define and configure nodes with various field types (string, number, boolean, dropdown, array, map, object, expression, etc.).
- **Edge Management**: Connect nodes with labeled, color-coded edges representing different flow outcomes.
- **Expression Support**: Use JSONata expressions in fields for dynamic data transformation and validation.
- **State Management**: Powered by Redux Toolkit for robust state handling.
- **Persistence**: Save and load flows from local storage.
- **API Integration**: Connects to backend APIs for flow and handler management (see `.env` for API URL).
- **Keyboard Shortcuts**: `Ctrl+S` or `Cmd+S` to save your flow.
- **Ant Design UI**: Clean, modern interface with Ant Design components.

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) (or the port specified by Vite).

### Building for Production

```bash
npm run build:prod
```

### Linting

```bash
npm run lint
```

## Usage

- **Create Nodes**: Click in the editor area to create a new node.
- **Edit Nodes**: Click the settings icon on a node to edit its fields.
- **Connect Nodes**: Drag from a node's handle to another node to create an edge.
- **Set Initial Command**: Use the select icon to mark a node as the initial command.
- **Delete Nodes/Edges**: Use the delete icon or context menu.
- **Expression Fields**: Use JSONata syntax for dynamic fields. [Validate expressions here](https://try.jsonata.org/).

## Data Model

- **Flow**: Represents a workflow, containing handlers and metadata. (removed for demo purposes)
- **Handler**: A set of commands (nodes) and their connections (removed for demo purposes).
- **Command (Node)**: An action or step in the flow, with configurable fields and outgoing edges.
- **Edge**: Connects commands, representing transitions (e.g., onSuccess, onFailure).

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/)
- [@xyflow/react](https://xyflow.dev/) (for flow/node editor)
- [JSONata](https://jsonata.org/) (for expression fields)

## Project Structure

```
src/
  api/         # API integration (Redux Toolkit Query)
  app/         # App entry, wrappers, store
  components/  # Flow editor, nodes, edges, data fields
  context/     # Flow context (Redux slices)
  schema/      # TypeScript types and schemas for flows, commands, etc.
  util/        # Utility functions
```

## Customization

- **Node Types & Fields**: Extend `src/schema/generic.ts` to add new command types or field types.
- **API Endpoints**: Configure API URLs in your environment variables.

## License

This project is private and not licensed for external use.

---
