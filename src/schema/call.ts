import { BaseCommandSchema } from "./generic";

const CallTransferCommandSchema: BaseCommandSchema = {
  command: "TransferCommand",
  type: "CALL_TRANSFER",
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
      itemType: "dropdown",
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
  type: "PLAY_MEDIA",
  fields: {
    mediaList: {
      key: "mediaList",
      name: "Media List",
      type: "array",
      itemType: "object",
      fields: [
        {
          key: "mediaId",
          name: "Media File",
          type: "dropdown",
          valueType: "api",
          apiPath: "http://localhost:8080/public/media",
          expression: `$.{
                      "id": mediaId,
                      "label": mediaName
                    }`,
        },
        {
          key: "offsetMillis",
          name: "Offset Millis",
          type: "number",
        },
        {
          key: "skipMillis",
          name: "Skip Millis",
          type: "number",
        },
      ],
    },
  },
  edges: {
    onSuccess: {
      name: "onSuccess",
      color: "#00FF00",
    },
  },
};

const HangupCommandSchema: BaseCommandSchema = {
  command: "HangupCommand",
  type: "HANGUP",
  fields: {
    reason: {
      key: "reason",
      name: "Reason",
      type: "string",
    },
  },
};

export {
  CallTransferCommandSchema,
  PlayMediaCommandSchema,
  HangupCommandSchema,
};
