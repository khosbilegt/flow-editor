import { BaseCommandSchema } from "./generic";

const CallTransferCommandSchema: BaseCommandSchema = {
  command: "TransferCommand",
  fields: {
    transferType: {
      name: "Transfer Type",
      type: "string",
    },
    agentId: {
      name: "Agent ID",
      type: "dropdown",
      valueType: "api",
      apiPath: "/api/agents",
      expression: "",
      condition: {
        field: "transferType",
        equals: "AGENT",
      },
    },
    queueId: {
      name: "Queue ID",
      type: "dropdown",
      apiPath: "/api/queues",
      valueType: "api",
      expression: "",
      condition: {
        field: "transferType",
        equals: "QUEUE",
      },
    },
    timeout: {
      name: "Timeout",
      type: "number",
    },
    ringingAudioList: {
      name: "Ringing Audio List",
      type: "array",
      items: {
        name: "Media File",
        type: "dropdown",
        valueType: "api",
        apiPath: "/api/audio",
        expression: "",
      },
    },
  },
  edges: {
    onTimeout: {
      name: "onTimeout",
      color: "#00FF00",
    },
    onFailure: {
      name: "onFailure",
      color: "#FF0000",
    },
  },
};

const PlayMediaCommandSchema: BaseCommandSchema = {
  command: "PlayMediaCommand",
  fields: {
    isInterruptible: {
      name: "Is Interruptible",
      type: "boolean",
    },
    repeatCount: {
      name: "Repeat Count",
      type: "number",
    },
    offsetMillis: {
      name: "Offset Millis",
      type: "number",
    },
    skipMillis: {
      name: "Skip Millis",
      type: "number",
    },
    mediaList: {
      name: "Media List",
      type: "array",
      items: {
        name: "Media File",
        type: "dropdown",
        valueType: "api",
        apiPath: "/api/audio",
        expression: "",
      },
    },
  },
  edges: {
    onSuccess: {
      name: "onSuccess",
      color: "#00FF00",
    },
    onFailure: {
      name: "onFailure",
      color: "#FF0000",
    },
  },
};

export { CallTransferCommandSchema, PlayMediaCommandSchema };
