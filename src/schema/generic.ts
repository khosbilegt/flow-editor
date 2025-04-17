type Condition = {
  field: string;
  equals: string | number | boolean;
};

type Dropdown = {
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
      name: string;
      type: "string" | "number" | "boolean" | "object";
      condition?: Condition;
    }
  | Dropdown
  | {
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

const RestAPICommandSchema: BaseCommandSchema = {
  command: "RestAPICommand",
  fields: {
    dataObjectId: {
      name: "Data Object ID",
      type: "dropdown",
      valueType: "api",
      apiPath: "https://contactx.unitel.mn/api/data-objects",
      expression: "",
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

export type { BaseCommandSchema, Field, Condition, Dropdown, SchemaEdge };
export { RestAPICommandSchema };
