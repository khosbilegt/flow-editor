import { EditNodeData } from "@/schema/generic";
import { Button, Flex, Form } from "antd";
import { useEffect, useState } from "react";
import BooleanField from "./data/BooleanField";
import NumberField from "./data/NumberField";
import TextField from "./data/TextField";
import DropdownField from "./data/DropdownField";
import ArrayField from "./data/ArrayField";
import ObjectField from "./data/ObjectField";

function FlowData({
  editData,
  closeModal,
}: {
  editData: EditNodeData | null;
  closeModal: () => void;
}) {
  const [localData, setLocalData] = useState<any>(editData?.data);

  const saveData = () => {
    console.log("saveData", localData);
    if (editData) {
      editData.data = localData;
    }
    closeModal();
  };

  useEffect(() => {
    setLocalData(editData?.data);
  }, [editData]);

  useEffect(() => {
    console.log(localData);
  }, [localData]);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      {editData?.schema?.fields &&
        Object.entries(editData.schema.fields).map(([key, field]) => {
          if (field.condition) {
            if (field.condition.type === "equals") {
              const conditionField =
                editData.schema.fields[field.condition.field];
              if (conditionField) {
                if (
                  field.condition.equals !== localData[field.condition.field]
                ) {
                  return null;
                }
              }
            } else {
              const conditionField =
                editData.schema.fields[field.condition.field];
              if (conditionField) {
                const regex = new RegExp(field.condition.regex || "");
                if (!regex.test(localData[field.condition.field])) {
                  return null;
                }
              }
            }
          }
          return (
            <Form.Item key={key} label={field.name}>
              {field.type === "string" && (
                <TextField
                  value={localData[field.key]}
                  setValue={(val: string) => {
                    setLocalData({
                      ...localData,
                      [field.key]: val,
                    });
                  }}
                />
              )}
              {field.type === "number" && (
                <NumberField
                  value={localData[field.key]}
                  setValue={(val: number) => {
                    setLocalData({
                      ...localData,
                      [field.key]: val,
                    });
                  }}
                />
              )}
              {field.type === "boolean" && (
                <BooleanField
                  value={localData[field.key]}
                  setValue={(val: boolean) => {
                    setLocalData({
                      ...localData,
                      [field.key]: val,
                    });
                  }}
                />
              )}
              {field.type === "dropdown" && (
                <DropdownField
                  value={localData[field.key]}
                  setValue={(val: string) => {
                    setLocalData({
                      ...localData,
                      [field.key]: val,
                    });
                  }}
                  dropdownValues={field?.values ? field.values : {}}
                />
              )}
              {field.type === "object" && <ObjectField />}
              {field.type === "array" && (
                <ArrayField
                  items={localData.values}
                  setItems={(items) => {
                    setLocalData({
                      ...localData,
                      [field.key]: items,
                    });
                  }}
                />
              )}
            </Form.Item>
          );
        })}
      <Form.Item label={null}>
        <Flex gap={10}>
          <Button type="primary" htmlType="submit" onClick={() => saveData()}>
            Save
          </Button>
          <Button htmlType="submit">Cancel</Button>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default FlowData;
