import { Select } from "antd";

function DropdownField({
  value,
  setValue,
  dropdownValues,
}: {
  value: string;
  setValue: (value: string) => void;
  dropdownValues: Record<string, string>; // Updated type
}) {
  return (
    <Select showSearch value={value} onChange={setValue}>
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
