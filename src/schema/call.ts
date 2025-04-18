import { BaseCommandSchema } from "./generic";

const CallTransferCommandSchema: BaseCommandSchema = {
  command: "TransferCommand",
  fields: {
    transferType: {
      key: "transferType",
      name: "Transfer Type",
      type: "dropdown",
      valueType: "static",
      values: {
        AGENT: "Agent",
        QUEUE: "Queue",
      },
    },
    agentId: {
      key: "agentId",
      name: "Agent ID",
      type: "dropdown",
      valueType: "api",
      apiPath: "/api/agents",
      expression: "",
      condition: {
        field: "transferType",
        type: "equals",
        equals: "AGENT",
      },
    },
    queueId: {
      key: "queueId",
      name: "Queue ID",
      type: "dropdown",
      apiPath: "/api/queues",
      valueType: "api",
      expression: "",
      condition: {
        field: "transferType",
        type: "equals",
        equals: "QUEUE",
      },
    },
    timeout: {
      key: "timeout",
      name: "Timeout",
      type: "number",
    },
    ringingAudioList: {
      key: "ringingAudioList",
      name: "Ringing Audio List",
      type: "array",
      items: {
        key: "mediaFile",
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
      key: "isInterruptible",
      name: "Is Interruptible",
      type: "boolean",
    },
    repeatCount: {
      key: "repeatCount",
      name: "Repeat Count",
      type: "number",
    },
    offsetMillis: {
      key: "offsetMillis",
      name: "Offset Millis",
      type: "number",
    },
    skipMillis: {
      key: "skipMillis",
      name: "Skip Millis",
      type: "number",
    },
    mediaList: {
      key: "mediaList",
      name: "Media List",
      type: "array",
      items: {
        key: "mediaFile",
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
