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
import { useCallback, useEffect, useState } from "react";
import {
  BaseCommandSchema,
  EditNodeData,
  getSchemaByCommand,
  RestAPICommandSchema,
} from "../schema/generic";
import { guidGenerator } from "../util/utils";
import { Drawer } from "antd";
import FlowNode, { type FlowNodeData } from "./FlowNode";
import FlowEdge from "./FlowEdge";
import FlowData from "./FlowData";
import FlowCommands from "./FlowCommands";
import { initialCommands } from "./dummy";

const nodeTypes = {
  flow: FlowNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(
    []
  );
  // TODO: This should update via API when production.
  const [commands, setCommands] = useState(initialCommands);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [createConnection, setCreateConnection] =
    useState<FinalConnectionState | null>(null);
  const [isCreateCommandDrawerOpen, setCreateCommandDrawerOpen] =
    useState(false);
  const [isEditCommandDrawerOpen, setEditCommandDrawerOpen] =
    useState<boolean>();
  const [editData, setEditData] = useState<EditNodeData | null>(null);

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
      if (!state.isValid) {
        setCreateConnection(state);
        setCreateCommandDrawerOpen(true);
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
          data: { schema, deleteNode: deleteNode, openNodeModal },
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

  const openNodeModal = (schema: BaseCommandSchema, id: string) => {
    setEditData({
      id: id,
      schema: schema,
      data: commands.find((command) => command.id === id)?.fields,
    });
    setEditCommandDrawerOpen(true);
  };

  const handleCreateSubmit = (schema: BaseCommandSchema) => {
    const id = guidGenerator();
    addNode(
      id,
      {
        x: createConnection?.to?.x ? createConnection?.to?.x : 0,
        y: createConnection?.to?.y ? createConnection?.to?.y : 0,
      },
      schema
    );
    setEdges((els) =>
      addEdge(
        {
          ...createConnection,
          id: id,
          source: createConnection?.fromNode?.id
            ? createConnection?.fromNode?.id
            : "",
          sourceHandle: createConnection?.fromHandle?.id
            ? createConnection?.fromHandle?.id
            : "",
          target: id,
          type: "flow",
          data: {
            removeEdge: removeEdge,
          },
        },
        els
      )
    );
    setCreateCommandDrawerOpen(false);
    setCreateConnection(null);
  };

  useEffect(() => {
    const tempNodes: Node<FlowNodeData>[] = [];
    const tempEdges: Edge[] = [];
    commands?.map((command) => {
      const commandSchema = getSchemaByCommand(command.command);
      tempNodes.push({
        id: command.id,
        position: command.position,
        data: {
          schema: commandSchema ? commandSchema : RestAPICommandSchema,
          deleteNode,
          openNodeModal,
        },
        type: "flow",
      });
      tempEdges.push({
        id: command.id,
        source: command.id,
        target: command?.edges?.onSuccess?.target
          ? command?.edges?.onSuccess?.target
          : "",
        type: "flow",
        data: {
          removeEdge: removeEdge,
        },
      });
    });
    setNodes(tempNodes);
    setEdges(tempEdges);
  }, [commands]);

  return (
    <ReactFlowProvider>
      <Drawer
        title={"Edit Node"}
        placement="right"
        width={"40%"}
        open={isEditCommandDrawerOpen}
        onClose={() => setEditCommandDrawerOpen(false)}
      >
        <FlowData
          editData={editData}
          setEditData={(editData) => {
            console.log(editData);
            setCommands((prev) =>
              prev.map((command) => {
                if (command.id === editData?.id) {
                  return {
                    ...command,
                    fields: editData?.data,
                  };
                }
                return command;
              })
            );
          }}
          closeModal={() => setEditCommandDrawerOpen(false)}
        />
      </Drawer>
      <Drawer
        title={"Create Node"}
        placement="right"
        width={600}
        open={isCreateCommandDrawerOpen}
        onClose={() => setCreateCommandDrawerOpen(false)}
      >
        <FlowCommands createNode={handleCreateSubmit} />
      </Drawer>
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
