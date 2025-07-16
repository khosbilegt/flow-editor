import { FlowValidationError } from "./architect";

type APIParam = {
  key: string;
  type: "string" | "number" | "boolean";
  source: "field" | "inject";
  injectKey?: string;
};

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
  params?: APIParam[];
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
      keyType?: "string" | "number";
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
      params?: APIParam[];
      values?: Record<string, string>;
      items?: Field;
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
      keyType?: "string" | "number";
      items: Field;
      fields: Field[];
      condition?: Condition;
      valueType?: "api" | "static";
      apiPath?: string;
      expression?: string;
      values?: Record<string, string>;
      params?: APIParam[];
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
      params?: APIParam[];
      values?: Record<string, string>;
      items?: Field;
    };

interface BaseCommandSchema {
  command: string;
  type: string;
  description?: string;
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

const MakePostCommandSchema: BaseCommandSchema = {
  command: "Make Facebook Post",
  type: "MAKE_POST",
  description: "Make a post on Facebook",
  fields: {
    url: {
      key: "message",
      name: "Message",
      type: "string",
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
}

const RestAPICommandSchema: BaseCommandSchema = {
  command: "API Call",
  type: "API_CALL",
  description: "Make an API call",
  fields: {
    url: {
      key: "url",
      name: "URL",
      type: "string",
    },
    method: {
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
    queryParams: {
      key: "queryParams",
      name: "Query Parameters",
      type: "array",
      itemType: "object",
      fields: [
        {
          key: "key",
          name: "Key",
          type: "string",
        },
        {
          key: "expression",
          name: "Value",
          type: "string",
        },
      ],
    },
    pathParams: {
      key: "pathParams",
      name: "Path Parameters",
      type: "array",
      itemType: "object",
      fields: [
        {
          key: "key",
          name: "Key",
          type: "string",
        },
        {
          key: "expression",
          name: "Value",
          type: "string",
        },
      ],
    },
    bodyParams: {
      key: "bodyParams",
      name: "Body Parameters",
      type: "array",
      itemType: "object",
      fields: [
        {
          key: "key",
          name: "Key",
          type: "string",
        },
        {
          key: "expression",
          name: "Value",
          type: "string",
        },
      ],
    },
    body: {
      key: "body",
      name: "Body",
      type: "text",
    },
    timeout: {
      key: "timeout",
      name: "Timeout",
      type: "number",
    },
    responseHandler: {
      key: "responseHandler",
      name: "Response Handlers",
      type: "map",
      keyType: "number",
      itemType: "object",
      fields: [
        {
          key: "variables",
          name: "Variables",
          type: "array",
          itemType: "object",
          fields: [
            {
              key: "key",
              name: "Key",
              type: "string",
            },
            {
              key: "expression",
              name: "Value",
              type: "string",
            },
          ],
        },
      ],
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
  command: "Check Condition",
  type: "CHECK_CONDITION",
  description: "Check a condition",
  fields: {
    expression: {
      key: "expression",
      name: "Expression",
      isExpression: true,
      type: "string",
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

// const JumpCommandSchema: BaseCommandSchema = {
//   command: "Jump to Handler",
//   type: "JUMP",
//   description: "Start executing another handler",
//   fields: {
//     target: {
//       key: "handlerId",
//       name: "Target",
//       type: "dropdown",
//       valueType: "api",
//       apiPath:
//         "https://api-dev-cec.unitel.mn:8000/architect/v2/public/flow/${flowId}/handler/list?version=${version}",
//       params: [
//         {
//           key: "flowId",
//           type: "number",
//           source: "inject",
//           injectKey: "flowId",
//         },
//         {
//           key: "version",
//           type: "string",
//           source: "inject",
//           injectKey: "selectedVersion",
//         },
//       ],
//       expression: `$map($, function($v) {
//                   {
//                     "id": $v.handlerId,
//                     "label": $v.handlerName ? $v.handlerName : $v.handlerId
//                   }
//                 })`,
//     },
//   },
// };


const SetVariableCommandSchema: BaseCommandSchema = {
  command: "Set Variable",
  type: "SET_CONTEXT_VARIABLE",
  description: "Set a variable in the context of the flow",
  fields: {
    variableName: {
      key: "variableName",
      name: "Variable Name",
      type: "string",
    },
    variableValue: {
      key: "expression",
      name: "Expression",
      type: "string",
    },
  },
  edges: {
    onSuccess: {
      name: "onSuccess",
      color: "#389E0D",
    },
  },
};

const commandList: BaseCommandSchema[] = [
  RestAPICommandSchema,
  CheckConditionCommandSchema,
  SetVariableCommandSchema,
  MakePostCommandSchema,
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
  APIParam,
};
export { getSchemaByCommand, RestAPICommandSchema, commandList };
