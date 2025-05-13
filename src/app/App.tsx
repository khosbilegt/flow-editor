import {
  Button,
  Dropdown,
  Flex,
  FloatButton,
  Form,
  Input,
  Layout,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Typography,
} from "antd";
import FlowEditor from "../components/FlowEditor";
import "@xyflow/react/dist/style.css";
import {
  BranchesOutlined,
  DeleteOutlined,
  FileOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import {
  useCloneFlowVersionMutation,
  useCreateFlowHandlerMutation,
  useDeleteFlowHandlerMutation,
  useDeployFlowVersionMutation,
  useGetFlowByIdQuery,
  useGetFlowHandlerByIdQuery,
  useListFlowHandlersQuery,
  useListFlowVersionQuery,
  useUpdateFlowHandlerMutation,
} from "../api/architect";
import { FlowCommand, FlowHandler } from "@/schema/architect";
import { useDispatch, useSelector } from "react-redux";
import {
  setFlowId,
  setHandlerId,
  setSelectedVersion,
} from "../context/FlowContext";
import { RootState } from "./store";
import { getSchemaByCommand } from "../schema/generic";

const { Search } = Input;

const { Header, Content, Sider } = Layout;

const { Title, Text } = Typography;

function App({
  flowId,
  initialVersion,
  initialHandlerId,
  navigateTo,
}: {
  flowId: number;
  initialVersion: string;
  initialHandlerId: string;
  navigateTo: (flowId: number, version: string, handlerId: string) => void;
}) {
  const dispatch = useDispatch();
  const handlerId = useSelector((state: RootState) => state.flow.handlerId);
  const selectedVersion = useSelector(
    (state: RootState) => state.flow.selectedVersion
  );

  // -1 must not fetch.
  const flowIdRef = useRef<number>(-1);
  const commandsRef = useRef<FlowCommand[]>([]);
  const selectedHandlerRef = useRef<FlowHandler | undefined>(undefined);
  const keyboardListenerInitialized = useRef(false);
  const [commands, setCommands] = useState<FlowCommand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalType, setCreateModalType] = useState<string>("");
  const [createModalValue, setCreateModalValue] = useState<any>({});

  const { data: flow } = useGetFlowByIdQuery(flowId, {
    skip: flowId === -1,
  });

  const { data: handlers } = useListFlowHandlersQuery(
    { flowId, version: selectedVersion },
    {
      skip:
        flowId === -1 ||
        selectedVersion === "" ||
        selectedVersion === "undefined" ||
        selectedVersion === undefined,
    }
  );

  const { data: selectedHandler } = useGetFlowHandlerByIdQuery(
    { flowId, handlerId, version: selectedVersion },
    {
      skip:
        flowId === -1 ||
        selectedVersion === "undefined" ||
        selectedVersion === undefined,
    }
  );

  const [createFlowHandler] = useCreateFlowHandlerMutation();

  const [updateFlowHandler, { isLoading: isSaving }] =
    useUpdateFlowHandlerMutation();

  const [deleteFlowHandler] = useDeleteFlowHandlerMutation();

  const { data: versions } = useListFlowVersionQuery(flowId, {
    skip: flowId === -1,
  });

  const [cloneFlowVersion] = useCloneFlowVersionMutation();

  const [deployFlowVersion] = useDeployFlowVersionMutation();

  const save = () => {
    if (selectedHandlerRef.current) {
      const commandMap: Record<string, FlowCommand> = {};
      commandsRef.current.forEach((command: FlowCommand) => {
        let formattedCommand: any = { ...command };
        const commandSchema = getSchemaByCommand(command.type);
        formattedCommand.actionCounter = command.fields?.actionCounter;
        Object.keys(formattedCommand.fields).forEach((key: string) => {
          const fieldValue = command.fields[key];
          if (commandSchema) {
            const fieldSchema = commandSchema.fields[key];
            if (fieldSchema) {
              if (fieldSchema.type === "array") {
                formattedCommand[key] = fieldValue;
              } else {
                formattedCommand[key] = fieldValue;
              }
            }
          }
        });
        delete formattedCommand.fields;

        Object.keys(formattedCommand.edges).forEach((key: string) => {
          if (command?.edges && command?.edges[key]) {
            formattedCommand[key] = command?.edges[key].target;
          }
        });

        commandMap[command.id] = formattedCommand;
        delete commandMap[command.id].edges;
      });
      let updatedDefinition: FlowHandler = {
        ...selectedHandlerRef.current,
        commands: commandMap,
        definitionVersion: initialVersion,
      };
      updateFlowHandler({
        flowId: flowIdRef.current,
        data: updatedDefinition,
      })
        .unwrap()
        .then((res) => {
          console.log("Update successful", res);
        });
    }
  };

  useEffect(() => {
    if (
      flow?.deployedVersion &&
      (selectedVersion === undefined ||
        selectedVersion === "undefined" ||
        selectedVersion === "")
    ) {
      navigateTo(flowId, flow.deployedVersion, handlerId);
    }
  }, [flow]);

  useEffect(() => {
    flowIdRef.current = Number(flowId);
    dispatch(setFlowId(flowId));
    dispatch(setFlowId(Number(flowId)));
    dispatch(setHandlerId(initialHandlerId));
    dispatch(setSelectedVersion(initialVersion));
    console.log("Changed", selectedVersion);
  }, [flowId, initialHandlerId, initialVersion]);

  useEffect(() => {
    if (keyboardListenerInitialized.current) return;
    keyboardListenerInitialized.current = true;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        save();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (selectedHandler) {
      const tempCommands: FlowCommand[] = [];
      Object.keys(selectedHandler.commands).map((key) => {
        const command: FlowCommand = selectedHandler.commands[key];
        tempCommands.push(command);
      });
      setCommands(tempCommands);
    }
  }, [selectedHandler]);

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  useEffect(() => {
    if (selectedHandler) {
      selectedHandlerRef.current = selectedHandler;
    }
  }, [selectedHandler]);

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          background: "none",
          border: "1px solid gray",
        }}
      >
        <Flex align="center">
          <Title level={4}>{flow?.flowName}</Title>
        </Flex>
        <Flex align="center" gap={10}>
          <Button type="primary">Edit</Button>
          <Popconfirm
            title="Are you sure you want to deploy this version?"
            onConfirm={() => {
              deployFlowVersion({
                flowId: flowIdRef.current,
                version: selectedVersion,
              })
                .unwrap()
                .then((res) => {
                  console.log("Deploy successful", res);
                });
            }}
          >
            <Button danger>Deploy</Button>
          </Popconfirm>
        </Flex>
      </Header>
      <Layout style={{ padding: "15px" }}>
        <Sider style={{ background: "none" }}>
          <Flex vertical gap={5}>
            <Text type="secondary">Deployed: {flow?.deployedVersion}</Text>
            <Flex justify="space-between" gap={5}>
              <Select
                placeholder="Version"
                style={{ width: "100%" }}
                value={selectedVersion}
                options={versions?.map((version) => ({
                  label: version.definitionVersion,
                  value: version.definitionVersion,
                }))}
                onChange={(e) => {
                  navigateTo(flowId, e, handlerId);
                }}
              />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: "New Version",
                      icon: <BranchesOutlined />,
                      onClick: () => setCreateModalType("version"),
                    },
                    {
                      key: "2",
                      label: "New Handler",
                      icon: <FileOutlined />,
                      onClick: () => setCreateModalType("handler"),
                    },
                  ],
                }}
              >
                <Button type="primary" icon={<PlusOutlined />} />
              </Dropdown>
            </Flex>
            <Search
              placeholder="Search handler"
              onChange={(e) => setSearchTerm(e?.target?.value)}
              allowClear
              enterButton
            />
            {handlers
              ?.slice()
              .sort((a, b) => {
                if (a.handlerId === "MAIN") return -1;
                if (b.handlerId === "MAIN") return 1;
                return a.handlerName.localeCompare(b.handlerName);
              })
              .map((handler, index) => {
                if (
                  searchTerm &&
                  !handler.handlerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return null;
                }
                return (
                  <Dropdown
                    key={index}
                    trigger={["contextMenu"]}
                    menu={{
                      items: [
                        {
                          key: "1",
                          label: (
                            <Popconfirm
                              title="Are you sure you want to delete this handler?"
                              onConfirm={() => {
                                deleteFlowHandler({
                                  flowId: flowIdRef.current,
                                  handlerId: handler.handlerId,
                                  version: selectedVersion,
                                });
                              }}
                            >
                              <p>Delete</p>
                            </Popconfirm>
                          ),
                          icon: <DeleteOutlined />,
                          danger: true,
                          disabled: handler.handlerId === "MAIN",
                        },
                      ],
                    }}
                  >
                    <Button
                      style={{ width: "100%" }}
                      onClick={() =>
                        navigateTo(flowId, selectedVersion, handler.handlerId)
                      }
                      type={
                        handler.handlerId === handlerId ? "primary" : "default"
                      }
                    >
                      {handler.handlerId === "MAIN"
                        ? "Main Handler"
                        : handler.handlerName}
                    </Button>
                  </Dropdown>
                );
              })}
          </Flex>
        </Sider>
        <Content
          style={{
            marginLeft: "15px",
            border: "2px solid black",
            borderRadius: "12px",
          }}
        >
          <FlowEditor
            handler={selectedHandlerRef.current}
            commands={commands}
            setCommands={setCommands}
            setInitialCommandId={(id) => {
              if (!selectedHandlerRef.current) return;

              const updatedHandler = {
                ...selectedHandlerRef.current,
                initialCommandId: id,
              };

              selectedHandlerRef.current = updatedHandler;

              setCommands((prevCommands) => [...prevCommands]);
            }}
          />
          <FloatButton
            onClick={() => save()}
            style={{ width: "50px", height: "50px" }}
            icon={
              isSaving ? (
                <Spin size="small" />
              ) : (
                <SaveOutlined height={100} width={100} />
              )
            }
          />
        </Content>
        <Modal
          title={createModalType === "version" ? "New Version" : "New Handler"}
          open={createModalType?.length > 0}
          onCancel={() => setCreateModalType("")}
          onOk={() => {
            if (createModalType === "version") {
              cloneFlowVersion({
                flowId: flowIdRef.current,
                toVersion: createModalValue?.toVersion,
                fromVersion: createModalValue?.fromVersion,
              });
              setCreateModalType("");
            } else {
              createFlowHandler({
                flowId: flowIdRef.current,
                handlerName: createModalValue?.handlerName,
                definitionVersion: selectedVersion,
              });
              setCreateModalType("");
            }
          }}
        >
          {createModalType === "version" && (
            <Form
              labelCol={{
                span: 6,
              }}
            >
              <Form.Item label="Clone From">
                <Select
                  placeholder="Select version"
                  style={{ width: "100%" }}
                  options={versions?.map((version) => ({
                    label: version.definitionVersion,
                    value: version.definitionVersion,
                  }))}
                  onChange={(e) =>
                    setCreateModalValue({
                      ...createModalValue,
                      fromVersion: e,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Version Name">
                <Input
                  onChange={(e) =>
                    setCreateModalValue({
                      ...createModalValue,
                      toVersion: e.target.value,
                    })
                  }
                  placeholder={"Enter version name (e.g. v1.0)"}
                />
              </Form.Item>
            </Form>
          )}
          {createModalType === "handler" && (
            <Form>
              <Form.Item label={"Handler Name"}>
                <Input
                  onChange={(e) =>
                    setCreateModalValue({
                      ...createModalValue,
                      handlerName: e.target.value,
                    })
                  }
                  placeholder={"Enter handler name (e.g. MyHandler)"}
                />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Layout>
    </Layout>
  );
}

export default App;
