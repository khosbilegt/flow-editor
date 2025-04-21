const initialCommands = [
  {
    id: "1",
    command: "RestAPI",
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
    command: "CallTransfer",
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
    command: "PlayMedia",
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
