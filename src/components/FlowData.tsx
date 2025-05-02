import { EditNodeData } from "@/schema/generic";
import { Button, Flex, Form, Input } from "antd";
import { useEffect, useState } from "react";
import BooleanField from "./data/BooleanField";
import NumberField from "./data/NumberField";
import StringField from "./data/StringField";
import DropdownField from "./data/DropdownField";
import ArrayField from "./data/ArrayField";
import TextField from "./data/TextField";
import MapField from "./data/MapField";
import ObjectField from "./data/ObjectField";

function FlowData({
  editData,
  setEditData,
  closeModal,
}: {
  editData: EditNodeData | null;
  setEditData: (data: EditNodeData | null) => void;
  closeModal: () => void;
}) {
  const [localName, setLocalName] = useState<string>(editData?.name || "");
  const [localData, setLocalData] = useState<any>(editData?.data);

  const saveData = () => {
    if (editData) {
      setEditData({
        ...editData,
        name: localName,
        data: localData,
      });
      editData?.setName(localName);
    }
    closeModal();
  };

  useEffect(() => {
    setLocalName(editData?.name || "");
    setLocalData(editData?.data);
  }, [editData]);

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      <Form.Item label="Name">
        <Input
          placeholder={"Name"}
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
        />
      </Form.Item>
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
                <StringField
                  value={localData[field.key]}
                  setValue={(val: string) => {
                    setLocalData({
                      ...localData,
                      [field.key]: val,
                    });
                  }}
                />
              )}
              {field.type === "text" && (
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
              {field.type === "map" && (
                <MapField
                  object={localData[field.key] ? localData[field.key] : {}}
                  itemType={field?.itemType ? field?.itemType : ""}
                  setObject={(object) => {
                    setLocalData({
                      ...localData,
                      [field.key]: object,
                    });
                  }}
                />
              )}
              {field.type === "array" && (
                <ArrayField
                  items={
                    localData[field.key]
                      ? Object.keys(localData[field.key]).map((key) => {
                          return localData[field.key][key];
                        })
                      : []
                  }
                  itemType={field?.itemType ? field?.itemType : ""}
                  itemFields={field?.fields ? field?.fields : []}
                  setItems={(items) => {
                    setLocalData({
                      ...localData,
                      [field.key]: items,
                    });
                  }}
                />
              )}
              {field.type === "object" && (
                <ObjectField object={{}} setObject={() => {}} fields={[]} />
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
