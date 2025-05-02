import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import DropdownField from "./DropdownField";
import ObjectField from "./ObjectField";
import { Field } from "@/schema/generic";

function ArrayField({
  itemType,
  items,
  setItems,
  itemFields,
}: {
  itemType: string;
  items: any[];
  setItems: (items: any[]) => void;
  itemFields: Field[];
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
                />
              );
            case "dropdown": {
              return (
                <DropdownField
                  key={index}
                  value={item}
                  setValue={(value) => {
                    const newItems = [...items];
                    newItems[index] = value;
                    setItems(newItems);
                  }}
                  dropdownValues={{ key1: "value1", key2: "value2" }}
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
                />
              );
            }
            default:
              return null;
          }
        };
        return (
          <Flex gap={10} key={index}>
            {renderField()}
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
