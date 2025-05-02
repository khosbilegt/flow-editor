import { FlowValidationError } from "@/schema/architect";
import { Select } from "antd";

function DropdownField({
  value,
  setValue,
  dropdownValues,
  error,
}: {
  value: string;
  setValue: (value: string) => void;
  dropdownValues: Record<string, string>;
  error?: FlowValidationError | null | undefined;
}) {
  return (
    <Select
      showSearch
      value={value}
      onChange={setValue}
      status={error !== null && error !== undefined ? "error" : undefined}
    >
      {dropdownValues &&
        Object.entries(dropdownValues).map(([key, value]) => {
          return (
            <Select.Option key={key} value={key}>
              {value}
            </Select.Option>
          );
        })}
    </Select>
  );
}

export default DropdownField;
