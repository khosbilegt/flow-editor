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
import { FlowCommand, FlowHandler } from "@/schema/architect";
import FlowNode, { type FlowNodeData } from "./FlowNode";
import FlowEdge from "./FlowEdge";
import FlowData from "./FlowData";
import FlowCommands from "./FlowCommands";

const nodeTypes = {
  flow: FlowNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

function FlowEditor({ handler }: { handler: FlowHandler | undefined }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(
    []
  );
  // TODO: This should update via API when production.
  const [commands, setCommands] = useState<FlowCommand[]>([]);
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
    const tempCommands = [...commands];
    tempCommands.push({
      id: id,
      name: "Default Name",
      type: schema.type,
      positionX: createConnection?.to?.x ? createConnection?.to?.x : 0,
      positionY: createConnection?.to?.y ? createConnection?.to?.y : 0,
      fields: {},
      edges: {},
      errors: [],
    });

    const sourceNodeId = createConnection?.fromNode?.id;
    const sourceHandleId = createConnection?.fromHandle?.id
      ? createConnection?.fromHandle?.id
      : "";
    const sourceCommand = tempCommands.find(
      (command) => command.id === sourceNodeId
    );

    if (sourceCommand) {
      const updatedSourceCommand = {
        ...sourceCommand,
        edges: {
          ...sourceCommand.edges,
          [sourceHandleId]: {
            id: sourceHandleId,
            type: "flow",
            target: id,
          },
        },
      };

      const updatedCommands = tempCommands.map((command) =>
        command.id === sourceCommand.id ? updatedSourceCommand : command
      );

      setCommands(updatedCommands);
    }

    setCreateCommandDrawerOpen(false);
    setCreateConnection(null);
  };

  useEffect(() => {
    const tempNodes: Node<FlowNodeData>[] = [];
    const tempEdges: Edge[] = [];
    commands?.map((command) => {
      const commandSchema = getSchemaByCommand(command.type);
      tempNodes.push({
        id: command.id,
        position: {
          x: command.positionX ? command.positionX : 0,
          y: command.positionY ? command.positionY : 0,
        },
        data: {
          schema: commandSchema ? commandSchema : RestAPICommandSchema,
          name: command.name,
          deleteNode,
          openNodeModal,
        },
        type: "flow",
      });
      if (command.edges) {
        Object.keys(command.edges).map((key) => {
          const edge = command.edges?.[key];
          tempEdges.push({
            id: `${command.id}-${key}`,
            source: command.id,
            sourceHandle: key,
            target: edge.target,
            type: "flow",
            data: {
              removeEdge: removeEdge,
            },
          });
        });
      }
    });
    setNodes(tempNodes);
    setEdges(tempEdges);
  }, [commands]);

  useEffect(() => {
    if (handler) {
      const tempCommands: FlowCommand[] = [];
      Object.keys(handler.commands).map((key) => {
        const command: FlowCommand = handler.commands[key];
        tempCommands.push(command);
        console.log(command);
      });
      setCommands(tempCommands);
    }
  }, [handler]);

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
