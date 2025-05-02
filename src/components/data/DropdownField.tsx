import { FlowValidationError } from "@/schema/architect";
import { Field } from "@/schema/generic";
import { Select } from "antd";
import { useEffect, useState } from "react";
import jsonata from "jsonata";

const { Option } = Select;

function DropdownField({
  value,
  setValue,
  field,
  error,
}: {
  value: string;
  setValue: (value: string) => void;
  field: Field;
  error?: FlowValidationError | null | undefined;
}) {
  const [dropdownValues, setDropdownValues] = useState<any[]>([]);

  const fetchDropdownValues = async (path: string, expression: string) => {
    const response = await fetch(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching dropdown values:", error);
      });

    const expr = jsonata(expression || "");
    const result = await expr.evaluate(response);
    const tempDropdownValues: any[] = [];
    result?.forEach((item: any) => {
      if (item.id && item.label) {
        tempDropdownValues.push({
          id: item.id,
          label: item.label,
        });
      }
    });
    setDropdownValues(tempDropdownValues);
  };

  useEffect(() => {
    if (field?.valueType === "api") {
      fetchDropdownValues(field.apiPath || "", field.expression || "");
    }
    console.log(field);
  }, [field]);

  return (
    <Select
      showSearch
      value={value}
      onChange={setValue}
      status={error !== null && error !== undefined ? "error" : undefined}
    >
      {dropdownValues?.map((item: any) => {
        return (
          <Select.Option key={item.id} value={item.id}>
            {item.label}
          </Select.Option>
        );
      })}
    </Select>
  );
}

export default DropdownField;
