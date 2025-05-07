import { EditNodeData, Field } from "@/schema/generic";
import { Alert, Button, Flex, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import BooleanField from "./data/BooleanField";
import NumberField from "./data/NumberField";
import StringField from "./data/StringField";
import DropdownField from "./data/DropdownField";
import ArrayField from "./data/ArrayField";
import TextField from "./data/TextField";
import MapField from "./data/MapField";
import ObjectField from "./data/ObjectField";
import { FlowValidationError } from "@/schema/architect";

const { Text } = Typography;

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
  const [localErrors, setLocalErrors] = useState<
    Record<string, FlowValidationError>
  >({});

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
    let tempErrors: Record<string, FlowValidationError> = {};
    if (editData?.errors) {
      editData.errors.forEach((error) => {
        tempErrors[error.field] = error;
      });
    }
    setLocalErrors(tempErrors);
  }, [editData]);

  return (
    <Form labelCol={{ span: 10 }} wrapperCol={{ span: 18 }}>
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
                  error={localErrors[field.key]}
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
                  error={localErrors[field.key]}
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
                  error={localErrors[field.key]}
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
                  error={localErrors[field.key]}
                />
              )}
              {field.type === "dropdown" && (
                <DropdownField
                  value={localData[field.key]}
                  field={field}
                  setValue={(val: string) => {
                    setLocalData({
                      ...localData,
                      [field.key]: val,
                    });
                  }}
                  error={localErrors[field.key]}
                />
              )}
              {field.type === "map" && (
                <MapField
                  object={localData[field.key] ? localData[field.key] : {}}
                  keyType={field.keyType ? field.keyType : "string"}
                  itemType={field?.itemType ? field?.itemType : ""}
                  itemFields={field?.fields ? field?.fields : []}
                  setObject={(object) => {
                    setLocalData({
                      ...localData,
                      [field.key]: object,
                    });
                  }}
                  error={localErrors[field.key]}
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
                  itemFields={
                    field?.itemType === "dropdown"
                      ? [field?.items].filter((item): item is Field => !!item)
                      : field?.fields
                      ? field?.fields.filter((item): item is Field => !!item)
                      : []
                  }
                  setItems={(items) => {
                    setLocalData({
                      ...localData,
                      [field.key]: items,
                    });
                  }}
                  error={localErrors[field.key]}
                />
              )}
              {field.type === "object" && (
                <ObjectField
                  object={{}}
                  setObject={() => {}}
                  fields={[]}
                  error={localErrors[field.key]}
                />
              )}
              {localErrors[field.key] && (
                <Text style={{ color: "red" }}>
                  {localErrors[field.key].errorMessage}
                </Text>
              )}
            </Form.Item>
          );
        })}
      <Form.Item label={null}>
        <Flex gap={10}>
          <Button type="primary" onClick={() => saveData()}>
            Save
          </Button>
        </Flex>
      </Form.Item>
      {editData?.errors?.map((error, index) => {
        if (error?.field?.startsWith("on")) {
          return (
            <Alert
              key={index}
              message={error.field}
              description={error.errorMessage}
              type="error"
            />
          );
        }
      })}
    </Form>
  );
}

export default FlowData;
