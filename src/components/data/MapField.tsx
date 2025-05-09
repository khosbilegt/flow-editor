import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Input, InputNumber } from "antd";
import StringField from "./StringField";
import NumberField from "./NumberField";
import BooleanField from "./BooleanField";
import { FlowValidationError } from "@/schema/architect";
import ObjectField from "./ObjectField";
import { Field } from "@/schema/generic";
import ArrayField from "./ArrayField";

function MapField({
  keyType,
  itemType,
  itemFields,
  items,
  object,
  setObject,
  error,
}: {
  keyType: "string" | "number";
  itemType: string;
  itemFields: Field[];
  items: Field | undefined;
  object: any;
  setObject: (object: any) => void;
  error?: FlowValidationError | null | undefined;
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
                  error={error}
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
                  error={error}
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
                  error={error}
                />
              );
            }
            case "map": {
              return (
                <MapField
                  key={index}
                  itemType={itemType}
                  keyType={keyType}
                  itemFields={itemFields}
                  items={items}
                  object={object[key]}
                  setObject={(value) => {
                    setObject({
                      ...object,
                      [key]: value,
                    });
                  }}
                  error={error}
                />
              );
            }
            case "array": {
              return (
                <ArrayField
                  key={index}
                  itemType={items?.type ? items?.type : ""}
                  itemFields={[]}
                  items={object[key]}
                  setItems={(value) => {
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
            case "object": {
              return (
                <ObjectField
                  key={index}
                  fields={itemFields}
                  object={object[key]}
                  setObject={(e) => {
                    setObject({
                      ...object,
                      [key]: {
                        ...object[key],
                        ...e,
                      },
                    });
                  }}
                  error={error}
                />
              );
            }
          }
          return <></>;
        };
        if (
          itemType === "array" ||
          itemType === "object" ||
          itemType === "map"
        ) {
          return (
            <Flex gap={5} key={index} vertical>
              {keyType === "number" ? (
                <InputNumber
                  placeholder="Key"
                  value={key}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    const newObject = { ...object };
                    if (e) {
                      newObject[parseInt(e)] = newObject[key];
                      delete newObject[key];
                      setObject(newObject);
                    }
                  }}
                />
              ) : (
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
              )}
              {renderField()}
            </Flex>
          );
        }
        return (
          <Flex gap={5} key={index}>
            {keyType === "number" ? (
              <InputNumber
                placeholder="Key"
                value={key}
                onChange={(e) => {
                  const newObject = { ...object };
                  if (e) {
                    newObject[parseInt(e)] = newObject[key];
                    delete newObject[key];
                    setObject(newObject);
                  }
                }}
              />
            ) : (
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
            )}
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
          let newKey: any = "";
          if (keyType === "number") {
            newKey = 0;
          } else {
            newKey = `newKey${Object.keys(object).length}`;
          }
          if (itemType === "array") {
            setObject({
              ...object,
              [newKey]: [],
            });
          } else {
            setObject({
              ...object,
              [newKey]: "",
            });
          }
        }}
      >
        Add Field
      </Button>
    </Flex>
  );
}

export default MapField;
