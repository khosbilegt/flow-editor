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
      type: "string" | "number" | "boolean" | "object";
      condition?: Condition;
    }
  | Dropdown
  | {
      key: string;
      name: string;
      type: "array";
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
      type: "array",
      items: {
        key: "queryParam",
        name: "Query Parameter",
        type: "string",
      },
    },
    pathParams: {
      key: "pathParams",
      name: "Path Parameters",
      type: "array",
      items: {
        key: "pathParam",
        name: "Path Parameter",
        type: "string",
      },
    },
    body: {
      key: "body",
      name: "Body",
      type: "object",
      condition: {
        field: "type",
        type: "regex",
        regex: "POST|PUT|PATCH",
      },
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

export type {
  BaseCommandSchema,
  Field,
  Condition,
  Dropdown,
  SchemaEdge,
  EditNodeData,
};
export { RestAPICommandSchema };
