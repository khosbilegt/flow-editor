interface DummyCommand {
  id: string;
  command: string;
  position: {
    x: number;
    y: number;
  };
  fields: Record<string, any>;
  edges?: Record<string, any>;
}

const initialCommands: DummyCommand[] = [
  {
    id: "1",
    command: "RestAPICommand",
    position: {
      x: 0,
      y: 0,
    },
    fields: {
      test: "test",
    },
    edges: {
      onSuccess: {
        id: "onSuccess",
        type: "flow",
        target: "2",
      },
      onError: {
        id: "onError",
        type: "flow",
      },
      onTimeout: {
        id: "onTimeout",
        type: "flow",
      },
    },
  },
  {
    id: "2",
    command: "CallTransferCommand",
    position: {
      x: 500,
      y: 500,
    },
    fields: {
      test: "test",
    },
  },
  {
    id: "3",
    command: "PlayMediaCommand",
    position: {
      x: 500,
      y: 0,
    },
    fields: {
      test: "test",
    },
  },
];

export { initialCommands };
