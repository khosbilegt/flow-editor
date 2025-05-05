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

const MenuCommandSchema: BaseCommandSchema = {
  command: "MenuCommand",
  type: "IVR_MENU",
  fields: {
    infoMedia: {
      key: "infoMedia",
      name: "Info Media",
      type: "array",
      itemType: "object",
      fields: [
        {
          key: "mediaId",
          name: "Info Media",
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
    idleTimeout: {
      key: "idleTimeout",
      name: "Idle Timeout",
      type: "number",
    },
    idleTimeoutTolerance: {
      key: "idleTimeoutTolerance",
      name: "Idle Timeout Tolerance",
      type: "number",
    },
    idleTimeoutWarningMedia: {
      key: "idleTimeoutWarningMedia",
      name: "Idle Timeout Warning",
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
    incorrectDTMFTolerance: {
      key: "incorrectDTMFTolerance",
      name: "Incorrect DTMF Tolerance",
      type: "number",
    },
    incorrectDTMFWarningMedia: {
      key: "incorrectDTMFWarningMedia",
      name: "Incorrect DTMF Warning",
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
    onDTMF_0: {
      name: "0",
      color: "black",
    },
    onDTMF_1: {
      name: "1",
      color: "black",
    },
    onDTMF_2: {
      name: "2",
      color: "black",
    },
    onDTMF_3: {
      name: "3",
      color: "black",
    },
    onDTMF_4: {
      name: "4",
      color: "black",
    },
    onDTMF_5: {
      name: "5",
      color: "black",
    },
    onDTMF_6: {
      name: "6",
      color: "black",
    },
    onDTMF_7: {
      name: "7",
      color: "black",
    },
    onDTMF_8: {
      name: "8",
      color: "black",
    },
    onDTMF_9: {
      name: "9",
      color: "black",
    },
    onDTMF_AST: {
      name: "*",
      color: "black",
    },
    onDTMF_HASH: {
      name: "#",
      color: "black",
    },
    onIncorrectDTMF: {
      name: "onIncorrectDTMF",
      color: "red",
    },
    onTimeout: {
      name: "onTimeout",
      color: "red",
    },
  },
};

export {
  CallTransferCommandSchema,
  PlayMediaCommandSchema,
  HangupCommandSchema,
  MenuCommandSchema,
};
