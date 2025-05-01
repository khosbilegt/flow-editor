import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Card, Flex, Popconfirm, Typography } from "antd";
import { BaseCommandSchema, SchemaEdge } from "../schema/generic";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Text } = Typography;

export type FlowNodeData = {
  schema: BaseCommandSchema;
  name: string;
  deleteNode: (id: string) => void;
  openNodeModal: (schema: BaseCommandSchema, id: string) => void;
};

export default memo(
  ({
    id,
    data: { name, schema, deleteNode, openNodeModal },
  }: NodeProps<Node<FlowNodeData>>) => {
    return (
      <Card
        style={{
          padding: "0px",
          boxShadow: "0 0 3px rgba(0, 0, 0, 0.4)",
        }}
        actions={[
          <SettingOutlined
            key={"settings"}
            onClick={() => openNodeModal(schema, id)}
          />,
          <Popconfirm
            okText="Yes"
            cancelText="No"
            title="Are you sure you want to delete this node?"
            onConfirm={() => {
              deleteNode(id);
            }}
          >
            <DeleteOutlined key={"delete"} style={{ color: "red" }} />
          </Popconfirm>,
        ]}
      >
        <Meta
          title={name ? name : "No Name"}
          description={
            <Flex vertical style={{ width: "100%" }}>
              <Text type="secondary">{schema.command}</Text>
              <Flex align="flex-end" vertical style={{ width: "100%" }}>
                {Object.keys(schema.edges || {}).map((key, index) => {
                  const edge = schema.edges?.[key] as SchemaEdge;
                  return (
                    <Text key={index} type="secondary">
                      {edge.name}
                    </Text>
                  );
                })}
              </Flex>
            </Flex>
          }
        />
        <Handle type="target" position={Position.Left} />
        <Flex vertical gap={10}>
          {Object.keys(schema.edges || {}).map((key, index) => {
            const edge = schema.edges?.[key] as SchemaEdge;
            return (
              <Handle
                key={index}
                type="source"
                id={edge.name}
                position={Position.Right}
                style={{
                  position: "absolute",
                  height: 12,
                  width: 12,
                  background: schema?.edges ? schema?.edges[key]?.color : "",
                  top: 85 + index * 22,
                }}
              />
            );
          })}
        </Flex>
      </Card>
    );
  }
);
