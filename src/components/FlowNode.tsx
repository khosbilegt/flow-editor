import { memo } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Badge, Card, Flex, Popconfirm, Typography } from "antd";
import { BaseCommandSchema, SchemaEdge } from "../schema/generic";
import {
  DeleteOutlined,
  SelectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FlowValidationError } from "@/schema/architect";

const { Meta } = Card;
const { Text } = Typography;

export type FlowNodeData = {
  schema: BaseCommandSchema;
  name: string;
  setName: (name: string) => void;
  deleteNode: (id: string) => void;
  errors: FlowValidationError[];
  openNodeModal: (
    schema: BaseCommandSchema,
    id: string,
    name: string,
    setName: (name: string) => void
  ) => void;
  initialCommandId: string;
  setInitialCommandId: (id: string) => void;
};

export default memo(
  ({
    id,
    data: {
      name,
      schema,
      setName,
      deleteNode,
      openNodeModal,
      errors,
      initialCommandId,
      setInitialCommandId,
    },
  }: NodeProps<Node<FlowNodeData>>) => {
    return (
      <Badge count={errors?.length}>
        <Card
          title={
            <Flex vertical>
              <Text>{name}</Text>
              <Text style={{ fontWeight: "400" }} type="secondary">
                {schema.command}
              </Text>
            </Flex>
          }
          style={{
            padding: "0px",
            outline: initialCommandId === id ? "2px solid aqua" : "",
            borderColor: errors?.length ? "red" : "black",
            boxShadow: "0 0 3px rgba(0, 0, 0, 0.4)",
          }}
          actions={[
            <Popconfirm
              okText="Yes"
              cancelText="No"
              title="Are you sure you want to make this the initial command?"
              onConfirm={() => {
                setInitialCommandId(id);
              }}
            >
              <SelectOutlined />
            </Popconfirm>,
            <SettingOutlined
              key={"settings"}
              onClick={() => openNodeModal(schema, id, name, setName)}
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
            description={
              <Flex vertical style={{ width: "100%" }}>
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
      </Badge>
    );
  }
);
