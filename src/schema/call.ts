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
      apiEndpoint: "/api/agents",
      condition: {
        field: "transferType",
        equals: "AGENT",
      },
    },
    queueId: {
      name: "Queue ID",
      type: "dropdown",
      apiEndpoint: "/api/queues",
      valueType: "api",
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
        apiEndpoint: "/api/audio",
      },
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
        apiEndpoint: "/api/audio",
      },
    },
  },
};

const RestAPICommandSchema: BaseCommandSchema = {
  command: "RestAPICommand",
  fields: {
    dataObjectId: {
      name: "Data Object ID",
      type: "dropdown",
      valueType: "api",
      apiEndpoint: "/api/data-objects",
    },
    type: {
      name: "HTTP Method",
      type: "dropdown",
      valueType: "static",
      values: {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        PATCH: "PATCH",
      },
    },
    authorization: {
      name: "Authorization Type",
      type: "dropdown",
      valueType: "static",
      values: {
        none: "None",
        basic: "Basic",
        bearer: "Bearer",
      },
    },
    queryParams: {
      name: "Query Parameters",
      type: "array",
      items: {
        name: "Query Parameter",
        type: "string",
      },
    },
    pathParams: {
      name: "Path Parameters",
      type: "array",
      items: {
        name: "Path Parameter",
        type: "string",
      },
    },
    body: {
      name: "Body",
      type: "object",
    },
  },
};

export {
  CallTransferCommandSchema,
  PlayMediaCommandSchema,
  RestAPICommandSchema,
};
