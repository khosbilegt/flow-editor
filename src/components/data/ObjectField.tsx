import { Field } from "@/schema/generic";
import { Flex, Input } from "antd";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import MapField from "./MapField";
import ArrayField from "./ArrayField";
import DropdownField from "./DropdownField";
import { FlowValidationError } from "@/schema/architect";

function ObjectField({
  object,
  setObject,
  fields,
  error,
}: {
  object: Record<string, any>;
  setObject: (object: Record<string, any>) => void;
  fields: Field[];
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <Flex vertical gap={5}>
      {fields?.map((field, index) => {
        const renderField = () => {
          switch (field.type) {
            case "string":
              return (
                <StringField
                  key={index}
                  value={object[field.key]}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [field.key]: value,
                    });
                  }}
                  error={error}
                />
              );
            case "number":
              return (
                <NumberField
                  key={index}
                  value={object[field.key]}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [field.key]: value,
                    });
                  }}
                  error={error}
                />
              );
            case "boolean":
              return (
                <BooleanField
                  key={index}
                  value={object[field.key]}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [field.key]: value,
                    });
                  }}
                  error={error}
                />
              );
            case "map":
              return (
                <MapField
                  key={index}
                  itemType={field?.itemType ? field?.itemType : ""}
                  object={object[field.key]}
                  setObject={(value) => {
                    setObject({
                      ...object,
                      [field.key]: value,
                    });
                  }}
                  error={error}
                />
              );
            case "array":
              return (
                <ArrayField
                  key={index}
                  items={object[field.key]}
                  setItems={(value) => {
                    setObject({
                      ...object,
                      [field.key]: value,
                    });
                  }}
                  itemType={field?.itemType ? field?.itemType : ""}
                  itemFields={field?.fields ? field?.fields : []}
                  error={error}
                />
              );
            case "dropdown":
              return (
                <DropdownField
                  key={index}
                  value={object[field.key]}
                  dropdownValues={{ "1": "1", "2": "2" }}
                  // dropdownValues={field?.values ? field.values : {}}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [field.key]: value,
                    });
                  }}
                  error={error}
                />
              );
            default:
              return null;
          }
        };

        return (
          <Flex gap={5} key={index}>
            <Input placeholder="Key" value={field.name} disabled />
            {renderField()}
          </Flex>
        );
      })}
    </Flex>
  );
}

export default ObjectField;
