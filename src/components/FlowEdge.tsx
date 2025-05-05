import { CloseCircleOutlined } from "@ant-design/icons";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSimpleBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { Button, Flex } from "antd";

type FlowEdgeData = {
  sourceCommandId: string;
  sourceHandlerId: string;
  targetCommandId: string;
  removeEdge: (
    id: string,
    sourceCommandId: string,
    sourceHandlerId: string
  ) => void;
};

export default function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps & { data: FlowEdgeData }) {
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
          <Button
            style={{ padding: 5, color: "red" }}
            danger
            onClick={() => {
              data?.removeEdge(id, data.sourceCommandId, data.sourceHandlerId);
            }}
          >
            <CloseCircleOutlined />
          </Button>
        </Flex>
      </EdgeLabelRenderer>
    </>
  );
}
