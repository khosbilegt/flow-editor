import { FlowValidationError } from "@/schema/architect";
import { APIParam, Field } from "@/schema/generic";
import { Select } from "antd";
import { useEffect, useState } from "react";
import jsonata from "jsonata";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { FlowState } from "../../context/FlowContext";

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
  const flowState: FlowState = useSelector((state: RootState) => state.flow);
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

  function replaceUrlParams(
    url: string,
    params: Record<string, string | number>
  ): string {
    return url.replace(/\${(.*?)}/g, (_, key) => {
      if (key in params) {
        return encodeURIComponent(params[key]);
      } else {
        console.warn(`Placeholder ${key} not found in params.`);
        return "";
      }
    });
  }

  useEffect(() => {
    if (field?.valueType === "api") {
      // let params = {
      //   flowId: flowState.flowId,
      //   handlerId: flowState.handlerId,
      //   selectedVersion: flowState.selectedVersion || "",
      // };
      let params: any = {};
      field?.params?.forEach((param: APIParam) => {
        if (param.source === "inject") {
          if (param.injectKey) {
            params[param.key] = flowState[param.injectKey];
          }
        }
      });

      const parsedPath = replaceUrlParams(field.apiPath || "", params);
      console.log(parsedPath);
      fetchDropdownValues(parsedPath, field.expression || "");
    }
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
