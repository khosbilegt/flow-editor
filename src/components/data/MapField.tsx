import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Input } from "antd";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";

function MapField({
  itemType,
  object,
  setObject,
}: {
  itemType: string;
  object: any;
  setObject: (object: any) => void;
}) {
  return (
    <Flex vertical gap={5}>
      {Object.keys(object)?.map((key, index) => {
        const renderField = () => {
          switch (itemType) {
            case "string": {
              return (
                <StringField
                  key={index}
                  value={object[key]}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [key]: value,
                    });
                  }}
                />
              );
            }
            case "number": {
              return (
                <NumberField
                  key={index}
                  value={object[key]}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [key]: value,
                    });
                  }}
                />
              );
            }
            case "boolean": {
              return (
                <BooleanField
                  key={index}
                  value={object[key]}
                  setValue={(value) => {
                    setObject({
                      ...object,
                      [key]: value,
                    });
                  }}
                />
              );
            }
            case "map": {
              return (
                <MapField
                  key={index}
                  itemType={itemType}
                  object={object[key]}
                  setObject={(value) => {
                    setObject({
                      ...object,
                      [key]: value,
                    });
                  }}
                />
              );
            }
            case "array": {
              return (
                <MapField
                  key={index}
                  itemType={itemType}
                  object={object[key]}
                  setObject={(value) => {
                    setObject({
                      ...object,
                      [key]: value,
                    });
                  }}
                />
              );
            }
            case "dropdown": {
              return (
                <Input
                  key={index}
                  value={object[key]}
                  onChange={(e) => {
                    setObject({
                      ...object,
                      [key]: e.target.value,
                    });
                  }}
                />
              );
            }
          }
          return <></>;
        };
        return (
          <Flex gap={5}>
            <Input
              placeholder="Key"
              value={key}
              onChange={(e) => {
                const newObject = { ...object };
                newObject[e.target.value] = newObject[key];
                delete newObject[key];
                setObject(newObject);
              }}
            />
            {renderField()}
            <Button
              danger
              type="primary"
              icon={<CloseCircleOutlined />}
              style={{ width: "40px" }}
              onClick={() => {
                const newObject = { ...object };
                delete newObject[key];
                setObject(newObject);
              }}
            />
          </Flex>
        );
      })}
      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          const newKey = `newKey${Object.keys(object).length}`;
          setObject({
            ...object,
            [newKey]: "",
          });
        }}
      >
        Add Field
      </Button>
    </Flex>
  );
}

export default MapField;
