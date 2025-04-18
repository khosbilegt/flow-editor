import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Input } from "antd";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";

function ObjectField({
  itemType,
  items,
  setItems,
}: {
  itemType: string;
  items: any[];
  setItems: (items: any[]) => void;
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
            default:
              return null;
          }
        };
        return (
          <Flex gap={5}>
            <Input placeholder="Key" />
            {renderField()}
            <Button
              danger
              type="primary"
              icon={<CloseCircleOutlined />}
              style={{ width: "40px" }}
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

export default ObjectField;
