import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Card, Flex, Popconfirm } from "antd";
import { BaseCommandSchema, SchemaEdge } from "../schema/generic";
import {
  DeleteOutlined,
  PhoneOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

export type FlowNodeData = {
  schema: BaseCommandSchema;
  deleteNode: (id: string) => void;
};

export default memo(
  ({ id, data: { schema, deleteNode } }: NodeProps<Node<FlowNodeData>>) => {
    return (
      <Card
        style={{
          padding: "0px",
          boxShadow: "0 0 3px rgba(0, 0, 0, 0.4)",
        }}
        actions={[
          <SettingOutlined key={"settings"} />,
          <Popconfirm
            okText="Yes"
            cancelText="No"
            title="Are you sure you want to delete this node?"
            onConfirm={() => deleteNode(id)}
          >
            <DeleteOutlined key={"delete"} style={{ color: "red" }} />
          </Popconfirm>,
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
          description={schema?.command}
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
                  height: 8,
                  width: 8,
                  background: schema?.edges ? schema?.edges[key]?.color : "",
                  marginTop: 15 * index,
                }}
              />
            );
          })}
        </Flex>
      </Card>
    );
  }
);
