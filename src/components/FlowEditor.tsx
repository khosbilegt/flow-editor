import {
  addEdge,
  Background,
  ControlButton,
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
import { FileAddOutlined } from "@ant-design/icons";

const nodeTypes = {
  flow: FlowNode,
};

const edgeTypes = {
  flow: FlowEdge,
};

function FlowEditor({
  handler,
  commands,
  setCommands,
  setInitialCommandId,
}: {
  handler: FlowHandler | undefined;
  setInitialCommandId: (id: string) => void;
  commands: FlowCommand[];
  setCommands: React.Dispatch<React.SetStateAction<FlowCommand[]>>;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(
    []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [createConnection, setCreateConnection] =
    useState<FinalConnectionState | null>(null);
  const [isCreateCommandDrawerOpen, setCreateCommandDrawerOpen] =
    useState(false);
  const [isEditCommandDrawerOpen, setEditCommandDrawerOpen] =
    useState<boolean>();
  const [editData, setEditData] = useState<EditNodeData | null>(null);
  const [edgeConnectParams, setEdgeConnectParams] = useState<
    Connection | undefined
  >();

  const removeEdge = useCallback(
    (id: string, sourceCommandId: string, sourceHandlerId: string) => {
      setEdges((els) => els.filter((edge) => edge.id !== id));
      setCommands((prev) =>
        prev.map((prevCommand: FlowCommand) => {
          if (prevCommand.id === sourceCommandId) {
            const updatedEdges = { ...prevCommand.edges };
            delete updatedEdges[sourceHandlerId];
            return {
              ...prevCommand,
              edges: updatedEdges,
            };
          }
          return prevCommand;
        })
      );
    },
    []
  );

  const onConnect = useCallback((params: Connection) => {
    setEdges((els) => {
      const updatedEdges = addEdge(
        {
          ...params,
          type: "flow",
          data: {
            sourceCommandId: params.source,
            sourceHandlerId: params.sourceHandle,
            targetCommandId: params.target,
            removeEdge: removeEdge,
          },
        },
        els
      );
      return updatedEdges;
    });
    setEdgeConnectParams(params);
  }, []);

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
    setCommands((prev) =>
      prev.filter((prevCommand: FlowCommand) => prevCommand.id !== id)
    );
  }, []);

  const openNodeModal = (
    schema: BaseCommandSchema,
    id: string,
    name: string,
    setName: (name: string) => void
  ) => {
    const tempCommand = commands.find((command) => command.id === id);
    setEditData({
      id: id,
      schema: schema,
      name: name,
      setName: setName,
      data: tempCommand?.fields,
      errors: tempCommand?.errors ? tempCommand?.errors : [],
    });
    setEditCommandDrawerOpen(true);
  };

  const handleCreateSubmit = (schema: BaseCommandSchema) => {
    const id = guidGenerator();
    const tempCommands = updateCommandPositions(commands);
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
    } else {
      setCommands(tempCommands);
    }

    setCreateCommandDrawerOpen(false);
    setCreateConnection(null);
  };

  const updateCommandPositions = (updateCommands: FlowCommand[]) => {
    const tempCommands: FlowCommand[] = [];
    nodes.map((node) => {
      const command = updateCommands.find((command) => command.id === node.id);
      if (command) {
        tempCommands.push({
          ...command,
          positionX: node.position.x,
          positionY: node.position.y,
        });
      }
    });
    return tempCommands;
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
          initialCommandId: handler?.initialCommandId
            ? handler?.initialCommandId
            : "",
          setInitialCommandId: (id: string) => {
            setInitialCommandId(id);
          },
          schema: commandSchema ? commandSchema : RestAPICommandSchema,
          name: command.name,
          setName: (name: string) => {
            setCommands((prev) =>
              prev.map((prevCommand: FlowCommand) => {
                if (prevCommand.id === command.id) {
                  return {
                    ...prevCommand,
                    name: name,
                  };
                }
                return prevCommand;
              })
            );
          },
          deleteNode,
          openNodeModal,
          errors: command.errors,
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
              sourceCommandId: command.id,
              sourceHandlerId: key,
              targetCommandId: edge.target,
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
    if (edgeConnectParams) {
      const tempCommands = updateCommandPositions(commands);
      const sourceNodeId = edgeConnectParams?.source;
      const sourceHandleId = edgeConnectParams?.sourceHandle;
      const targetNodeId = edgeConnectParams?.target;
      const updatedCommands: FlowCommand[] = [];
      tempCommands?.forEach((command) => {
        if (command.id === sourceNodeId && sourceHandleId) {
          const updatedSourceCommand = {
            ...command,
            edges: {
              ...command.edges,
              [sourceHandleId]: {
                id: sourceHandleId,
                type: "flow",
                target: targetNodeId,
              },
            },
          };
          updatedCommands.push(updatedSourceCommand);
        } else {
          updatedCommands.push(command);
        }
      });
      setCommands(updatedCommands);
    }
  }, [edgeConnectParams]);

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
              prev.map((command: FlowCommand) => {
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
        onNodeDragStop={() => setCommands(updateCommandPositions(commands))}
        attributionPosition="bottom-right"
      >
        <Background />
        <MiniMap position={"bottom-center"} />
        <Controls>
          <ControlButton onClick={() => setCreateCommandDrawerOpen(true)}>
            <FileAddOutlined />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export default FlowEditor;
