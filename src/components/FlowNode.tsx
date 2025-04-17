import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Card, Flex } from "antd";
import { BaseCommandSchema, SchemaEdge } from "../schema/generic";
import {
  DeleteOutlined,
  PhoneOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

export type FlowNodeData = {
  schema: BaseCommandSchema;
};

export default memo(({ data }: NodeProps<Node<FlowNodeData>>) => {
  return (
    <Card
      style={{
        padding: "0px",
        boxShadow: "0 0 3px rgba(0, 0, 0, 0.4)",
      }}
      styles={{
        actions: {
          height: "100%",
          // background: "red",
          padding: "0px",
        },
      }}
      actions={[
        <SettingOutlined key={"settings"} />,
        <DeleteOutlined key={"delete"} />,
      ]}
    >
      <Meta
        avatar={
          <Flex
            style={{
              height: "100%",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <PhoneOutlined style={{ fontSize: "20px" }} />
          </Flex>
        }
        title={"Random Name"}
        description={data?.schema?.command}
      />
      <Handle type="target" position={Position.Left} />
      <Flex vertical gap={10}>
        {Object.keys(data.schema.edges || {}).map((key, index) => {
          const edge = data.schema.edges?.[key] as SchemaEdge;
          return (
            <Handle
              key={index}
              type="source"
              id={edge.name}
              position={Position.Right}
            />
          );
        })}
      </Flex>
    </Card>
  );
});
