import { BaseCommandSchema } from "./generic";

const CallTransferCommandSchema: BaseCommandSchema = {
  command: "TransferCommand",
  type: "TRANSFER_COMMAND",
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
      apiPath: "https://api-dev-cec.unitel.mn:8000/architect/v2/api/agents",
      expression: "$",
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
      apiPath: "https://api-dev-cec.unitel.mn:8000/architect/v2/public/queue",
      valueType: "api",
      expression: `$map($, function($v) {
                  {
                    "id": $v.queueId,
                    "label": $v.queueName
                  }
                })`,
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
          apiPath:
            "https://api-dev-cec.unitel.mn:8000/architect/v2/public/media",
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
          apiPath:
            "https://api-dev-cec.unitel.mn:8000/architect/v2/public/media",
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
          apiPath:
            "https://api-dev-cec.unitel.mn:8000/architect/v2/public/media",
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
          apiPath:
            "https://api-dev-cec.unitel.mn:8000/architect/v2/public/media",
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
          apiPath:
            "https://api-dev-cec.unitel.mn:8000/architect/v2/public/media",
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
      name: "onDTMF_0",
      color: "black",
    },
    onDTMF_1: {
      name: "onDTMF_1",
      color: "black",
    },
    onDTMF_2: {
      name: "onDTMF_2",
      color: "black",
    },
    onDTMF_3: {
      name: "onDTMF_3",
      color: "black",
    },
    onDTMF_4: {
      name: "onDTMF_4",
      color: "black",
    },
    onDTMF_5: {
      name: "onDTMF_5",
      color: "black",
    },
    onDTMF_6: {
      name: "onDTMF_6",
      color: "black",
    },
    onDTMF_7: {
      name: "onDTMF_7",
      color: "black",
    },
    onDTMF_8: {
      name: "onDTMF_8",
      color: "black",
    },
    onDTMF_9: {
      name: "onDTMF_9",
      color: "black",
    },
    onDTMF_AST: {
      name: "onDTMF_*",
      color: "black",
    },
    onDTMF_HASH: {
      name: "onDTMF_#",
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

const RecordVoicemailCommandSchema: BaseCommandSchema = {
  command: "RecordVoicemailCommand",
  type: "RECORD_VOICEMAIL",
  fields: {
    maxDuration: {
      key: "maxDuration",
      name: "Max Duration",
      type: "number",
    },
    terminationDTMF: {
      key: "terminationDTMF",
      name: "Termination DTMF",
      type: "dropdown",
      valueType: "static",
      values: {
        "*": "*",
        "#": "#",
      },
    },
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
          apiPath:
            "https://api-dev-cec.unitel.mn:8000/architect/v2/public/media",
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

const CollectDTMFCommandSchema: BaseCommandSchema = {
  command: "CollectDTMFCommand",
  type: "COLLECT_DTMF",
  fields: {
    delimiter: {
      key: "delimiter",
      name: "Delimiter",
      type: "dropdown",
      valueType: "static",
      values: {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "0": "0",
        "*": "*",
        "#": "#",
      },
    },
    length: {
      key: "length",
      name: "Length",
      type: "number",
    },
    contextVariableName: {
      key: "contextVariableName",
      name: "Context Variable Name",
      type: "string",
    },
  },
  edges: {
    onSuccess: {
      name: "onSuccess",
      color: "#00FF00",
    },
  },
};

export {
  CallTransferCommandSchema,
  PlayMediaCommandSchema,
  HangupCommandSchema,
  MenuCommandSchema,
  RecordVoicemailCommandSchema,
  CollectDTMFCommandSchema,
};
