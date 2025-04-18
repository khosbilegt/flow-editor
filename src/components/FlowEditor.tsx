import {
  addEdge,
  Background,
  Controls,
  Edge,
  FinalConnectionState,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { Connection } from "@xyflow/react";
import { useCallback } from "react";
import FlowNode, { type FlowNodeData } from "./FlowNode";
import FlowEdge from "./FlowEdge";
import { BaseCommandSchema, RestAPICommandSchema } from "../schema/generic";
import { CallTransferCommandSchema } from "../schema/call";
import { guidGenerator } from "../util/utils";

const nodeTypes = {
  flow: FlowNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

function FlowEditor() {
  const removeEdge = useCallback(
    (id: string) => setEdges((els) => els.filter((edge) => edge.id !== id)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((els) =>
        addEdge(
          {
            ...params,
            type: "flow",
            data: {
              removeEdge: removeEdge,
            },
          },
          els
        )
      ),
    []
  );

  const onConnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, state: FinalConnectionState) => {
      console.log(state);
      if (!state.isValid) {
        const id = guidGenerator();
        addNode(
          id,
          {
            x: state?.to?.x ? state?.to?.x - 50 : 0,
            y: state?.to?.y ? state?.to?.y - 50 : 0,
          },
          RestAPICommandSchema
        );
        setEdges((els) =>
          addEdge(
            {
              ...state,
              id: id,
              source: state?.fromNode?.id ? state?.fromNode?.id : "",
              sourceHandle: state?.fromHandle?.id ? state?.fromHandle?.id : "",
              target: id,
              type: "flow",
              data: {
                removeEdge: removeEdge,
              },
            },
            els
          )
        );
      }
    },
    []
  );

  const addNode = useCallback(
    (
      id: string,
      position: { x: number; y: number },
      schema: BaseCommandSchema
    ) => {
      setNodes((els) =>
        els.concat({
          id,
          position,
          data: { schema, deleteNode: deleteNode },
          type: "flow",
        })
      );
    },
    []
  );

  const deleteNode = useCallback((id: string) => {
    setEdges((els) =>
      els.filter((edge) => edge.source !== id && edge.target !== id)
    );
    onNodesChange([{ type: "remove", id }]);
  }, []);

  const initialNodes: Node<FlowNodeData>[] = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { schema: RestAPICommandSchema, deleteNode: deleteNode },
      type: "flow",
    },
    {
      id: "2",
      position: { x: 500, y: 0 },
      data: { schema: CallTransferCommandSchema, deleteNode: deleteNode },
      type: "flow",
    },
    {
      id: "3",
      position: { x: 0, y: 250 },
      data: { schema: RestAPICommandSchema, deleteNode: deleteNode },
      type: "flow",
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "e1-2",
      source: "3",
      sourceHandle: "onSuccess",
      target: "2",
      type: "flow",
      data: {
        removeEdge: removeEdge,
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        attributionPosition="bottom-right"
      >
        <Background />
        <MiniMap position={"bottom-center"} />
        <Controls />
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export default FlowEditor;
