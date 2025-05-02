import { FlowValidationError } from "./architect";
import {
  CallTransferCommandSchema,
  HangupCommandSchema,
  PlayMediaCommandSchema,
} from "./call";

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
        | "map"
        | "array"
        | "dropdown"
        | "object";
      type: "string" | "number" | "boolean" | "map" | "array" | "text";
      fields?: Field[];
      condition?: Condition;
      isExpression?: boolean;
      valueType?: "api" | "static";
      apiPath?: string;
      expression?: string;
    }
  | Dropdown
  | {
      key: string;
      name: string;
      type: "array" | "map";
      itemType?:
        | "string"
        | "number"
        | "boolean"
        | "map"
        | "array"
        | "dropdown"
        | "object";
      items: Field;
      fields: Field[];
      condition?: Condition;
      valueType?: "api" | "static";
      apiPath?: string;
      expression?: string;
    }
  | {
      key: string;
      name: string;
      type: "object";
      fields: Field[];
      condition?: Condition;
      valueType?: "api" | "static";
      apiPath?: string;
      expression?: string;
    };

interface BaseCommandSchema {
  command: string;
  type: string;
  fields: Record<string, Field>;
  edges?: Record<string, SchemaEdge>;
}

interface EditNodeData {
  id: string;
  name: string;
  setName: (name: string) => void;
  schema: BaseCommandSchema;
  data: any;
  errors: FlowValidationError[];
}

const RestAPICommandSchema: BaseCommandSchema = {
  command: "APICallCommand",
  type: "API_CALL",
  fields: {
    dataObjectId: {
      key: "restClientId",
      name: "Rest Client ID",
      type: "dropdown",
      valueType: "api",
      apiPath: "https://contactx.unitel.mn/api/data-objects",
      expression: "",
    },
    type: {
      key: "method",
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
    // authorization: {
    //   key: "authorization",
    //   name: "Authorization Type",
    //   type: "dropdown",
    //   valueType: "static",
    //   values: {
    //     none: "None",
    //     basic: "Basic",
    //     bearer: "Bearer",
    //   },
    // },
    queryParams: {
      key: "queryParams",
      name: "Query Parameters",
      type: "map",
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
      type: "map",
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

const CheckConditionCommandSchema: BaseCommandSchema = {
  command: "CheckConditionCommand",
  type: "CHECK_CONDITION",
  fields: {
    expression: {
      key: "expression",
      name: "Expression",
      isExpression: true,
      type: "string",
    },
    dataObjects: {
      key: "dataObjects",
      name: "Data Objects",
      type: "array",
      itemType: "dropdown",
      items: {
        key: "dataObject",
        name: "Data Object",
        type: "dropdown",
        valueType: "static",
        values: {
          GET: "GET",
          POST: "POST",
          PUT: "PUT",
          DELETE: "DELETE",
          PATCH: "PATCH",
        },
        expression: "",
      },
    },
  },
  edges: {
    onTrue: {
      name: "onTrue",
      color: "#389E0D",
    },
    onFalse: {
      name: "onFalse",
      color: "#D32029",
    },
  },
};

const commandList: BaseCommandSchema[] = [
  RestAPICommandSchema,
  CallTransferCommandSchema,
  PlayMediaCommandSchema,
  HangupCommandSchema,
  CheckConditionCommandSchema,
];

const getSchemaByCommand = (type: string): BaseCommandSchema | null => {
  const schema = commandList.find((schema) => schema.type === type);
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
export { getSchemaByCommand, RestAPICommandSchema, commandList };
