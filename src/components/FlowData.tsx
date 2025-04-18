import { EditNodeData } from "@/schema/generic";
import { Button, Flex, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

function FlowData({
  editData,
  closeModal,
}: {
  editData: EditNodeData | null;
  closeModal: () => void;
}) {
  const [localData, setLocalData] = useState<any>(editData?.data);

  useEffect(() => {
    setLocalData(editData?.data);
  }, [editData]);

  useEffect(() => {
    console.log(localData);
  }, [localData]);

  const saveData = () => {
    console.log("saveData", localData);
    if (editData) {
      editData.data = localData;
    }
    closeModal();
  };

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
                <Input
                  type="text"
                  onChange={(e) => {
                    setLocalData({
                      ...localData,
                      [field.key]: e.target.value,
                    });
                  }}
                />
              )}
              {field.type === "number" && (
                <Input
                  type="number"
                  style={{ width: "400px" }}
                  value={localData[field.key]}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      [field.key]: e.target.value,
                    })
                  }
                />
              )}
              {field.type === "boolean" && (
                <Input
                  type="checkbox"
                  style={{ width: "400px" }}
                  value={localData[field.key]}
                  onChange={(e) =>
                    setLocalData({
                      ...localData,
                      [field.key]: e.target.checked,
                    })
                  }
                />
              )}
              {field.type === "dropdown" && (
                <Select
                  showSearch
                  value={localData[field.key]}
                  onChange={(value) =>
                    setLocalData({
                      ...localData,
                      [field.key]: value,
                    })
                  }
                >
                  {field.values &&
                    Object.entries(field.values).map(([key, value]) => {
                      return (
                        <Select.Option key={key} value={key}>
                          {value}
                        </Select.Option>
                      );
                    })}
                </Select>
              )}
              {field.type === "object" && <div>Object</div>}
              {field.type === "array" && <div>Array</div>}
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
