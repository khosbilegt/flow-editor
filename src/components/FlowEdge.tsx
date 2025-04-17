import { DeleteOutlined } from "@ant-design/icons";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { Button, Flex } from "antd";

export default function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: "1px",
        }}
      />
      <EdgeLabelRenderer>
        <Flex
          gap={5}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Flex>
      </EdgeLabelRenderer>
    </>
  );
}
