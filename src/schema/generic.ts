import { CallTransferCommandSchema, PlayMediaCommandSchema } from "./call";

type Condition = {
  field: string;
  type: "equals" | "regex";
  equals?: string | number | boolean;
  regex?: string;
};

type Dropdown = {
  key: string;
  name: string;
  type: "dropdown";
  valueType: "api" | "static";
  apiPath?: string;
  values?: Record<string, string>;
  condition?: Condition;
  expression?: string;
};

type SchemaEdge = {
  name: string;
  color: string;
};

type Field =
  | {
      key: string;
      name: string;
      itemType?:
        | "string"
        | "number"
        | "boolean"
        | "object"
        | "array"
        | "dropdown";
      type: "string" | "number" | "boolean" | "object" | "array" | "text";
      condition?: Condition;
    }
  | Dropdown
  | {
      key: string;
      name: string;
      type: "array" | "object";
      itemType?:
        | "string"
        | "number"
        | "boolean"
        | "object"
        | "array"
        | "dropdown";
      items: Field;
      condition?: Condition;
    };

interface BaseCommandSchema {
  command: string;
  fields: Record<string, Field>;
  edges?: Record<string, SchemaEdge>;
}

interface EditNodeData {
  id: string;
  schema: BaseCommandSchema;
  data: any;
}

const RestAPICommandSchema: BaseCommandSchema = {
  command: "RestAPICommand",
  fields: {
    dataObjectId: {
      key: "dataObjectId",
      name: "Data Object ID",
      type: "dropdown",
      valueType: "api",
      apiPath: "https://contactx.unitel.mn/api/data-objects",
      expression: "",
    },
    type: {
      key: "type",
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
      key: "authorization",
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
      key: "queryParams",
      name: "Query Parameters",
      type: "object",
      itemType: "string",
      items: {
        key: "queryParam",
        name: "Query Parameter",
        type: "string",
      },
    },
    pathParams: {
      key: "pathParams",
      name: "Path Parameters",
      type: "object",
      itemType: "number",
      items: {
        key: "pathParam",
        name: "Path Parameter",
        type: "string",
      },
    },
    body: {
      key: "body",
      name: "Body",
      type: "text",
    },
  },
  edges: {
    onSuccess: {
      name: "onSuccess",
      color: "#389E0D",
    },
    onTimeout: {
      name: "onTimeout",
      color: "#FAAD14",
    },
    onFailure: {
      name: "onFailure",
      color: "#D32029",
    },
  },
};

const getSchemaByCommand = (command: string): BaseCommandSchema | null => {
  const commandList: BaseCommandSchema[] = [
    RestAPICommandSchema,
    CallTransferCommandSchema,
    PlayMediaCommandSchema,
  ];
  const schema = commandList.find((schema) => schema.command === command);
  if (schema) {
    return schema;
  } else {
    return null;
  }
};

export type {
  BaseCommandSchema,
  Field,
  Condition,
  Dropdown,
  SchemaEdge,
  EditNodeData,
};
export { getSchemaByCommand, RestAPICommandSchema };
