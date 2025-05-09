import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import DropdownField from "./DropdownField";
import ObjectField from "./ObjectField";
import { Field } from "@/schema/generic";
import { FlowValidationError } from "@/schema/architect";

function ArrayField({
  itemType,
  items,
  setItems,
  itemFields,
  error,
}: {
  itemType: string;
  items: any[];
  setItems: (items: any[]) => void;
  itemFields: Field[];
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <Flex vertical gap={5}>
      {items?.map((item, index) => {
        const renderField = () => {
          switch (itemType) {
            case "string":
              return (
                <StringField
                  key={index}
                  value={item}
                  setValue={(value) => {
                    const newItems = [...items];
                    newItems[index] = value;
                    setItems(newItems);
                  }}
                  error={error}
                />
              );
            case "number":
              return (
                <NumberField
                  key={index}
                  value={item}
                  setValue={(value) => {
                    const newItems = [...items];
                    newItems[index] = value;
                    setItems(newItems);
                  }}
                  error={error}
                />
              );
            case "boolean":
              return (
                <BooleanField
                  key={index}
                  value={item}
                  setValue={(value) => {
                    const newItems = [...items];
                    newItems[index] = value;
                    setItems(newItems);
                  }}
                  error={error}
                />
              );
            case "dropdown": {
              return (
                <DropdownField
                  key={index}
                  field={itemFields[0]}
                  value={item}
                  setValue={(value) => {
                    const newItems = [...items];
                    newItems[index] = value;
                    setItems(newItems);
                  }}
                  error={error}
                />
              );
            }
            case "object": {
              return (
                <ObjectField
                  key={index}
                  fields={itemFields}
                  object={item}
                  setObject={(object) => {
                    const newItems = [...items];
                    newItems[index] = object;
                    setItems(newItems);
                  }}
                  error={error}
                />
              );
            }
            default:
              return null;
          }
        };
        return (
          <Flex gap={10} key={index}>
            <Flex gap={5} style={{ lineHeight: "32px" }}>
              {index + 1}. {renderField()}
            </Flex>
            <Button
              danger
              type="primary"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                const newItems = [...items];
                newItems.splice(index, 1);
                setItems(newItems);
              }}
            />
          </Flex>
        );
      })}
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          const newItems = [...items, ""];
          setItems(newItems);
        }}
      >
        Add Field
      </Button>
    </Flex>
  );
}

export default ArrayField;
