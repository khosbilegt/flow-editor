type Condition = {
  field: string;
  equals: string | number | boolean;
};

type Dropdown = {
  name: string;
  type: "dropdown";
  valueType: "api" | "static";
  apiEndpoint?: string;
  values?: Record<string, string>;
  condition?: Condition;
};

type Field<T> =
  | {
      name: string;
      type: "string" | "number" | "boolean" | "object";
      condition?: Condition;
    }
  | Dropdown
  | {
      name: string;
      type: "array";
      items: Field<any>;
      condition?: Condition;
    };

interface BaseCommandSchema {
  command: string;
  fields: Record<string, Field<any>>;
}

export type { BaseCommandSchema, Field, Condition, Dropdown };
