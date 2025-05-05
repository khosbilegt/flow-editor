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
  useCreateFlowHandlerMutation,
  useDeleteFlowHandlerMutation,
  useGetFlowByIdQuery,
  useGetFlowHandlerByIdQuery,
  useListFlowHandlersQuery,
  useListFlowVersionQuery,
  useUpdateFlowHandlerMutation,
} from "../api/architect";
import { FlowCommand, FlowHandler } from "@/schema/architect";

const { Search } = Input;

const { Header, Content, Sider } = Layout;

const { Title } = Typography;

function EditorLayout() {
  // -1 must not fetch.
  const flowIdRef = useRef<number>(-1);
  const commandRef = useRef<FlowCommand[]>([]);
  const selectedHandlerRef = useRef<FlowHandler | undefined>(undefined);
  const keyboardListenerInitialized = useRef(false);
  const [flowId, setFlowId] = useState<number>(-1);
  const [handlerId, setHandlerId] = useState<string>("MAIN");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [commands, setCommands] = useState<FlowCommand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalType, setCreateModalType] = useState<string>("");
  const [createModalValue, setCreateModalValue] = useState<string>("");

  const { data: flow } = useGetFlowByIdQuery(flowId, {
    skip: flowId === -1,
  });

  const { data: handlers } = useListFlowHandlersQuery(
    { flowId, version: selectedVersion },
    {
      skip: flowId === -1 || selectedVersion === "",
    }
  );

  const [createFlowHandler] = useCreateFlowHandlerMutation();

  const [updateFlowHandler, { isLoading: isSaving }] =
    useUpdateFlowHandlerMutation();

  const [deleteFlowHandler] = useDeleteFlowHandlerMutation();

  const { data: versions } = useListFlowVersionQuery(flowId, {
    skip: flowId === -1,
  });

  const { data: selectedHandler } = useGetFlowHandlerByIdQuery(
    { flowId, handlerId, version: selectedVersion },
    {
      skip: flowId === -1 || selectedVersion === "",
    }
  );

  const save = () => {
    if (selectedHandlerRef.current) {
      const commandMap: Record<string, FlowCommand> = {};
      commandRef.current.forEach((command: FlowCommand) => {
        let formattedCommand: any = { ...command };
        Object.keys(formattedCommand.fields).forEach((key: string) => {
          const fieldValue = command.fields[key];
          formattedCommand[key] = command.fields[key];
          if (typeof fieldValue === "object" && fieldValue !== null) {
            if (Array.isArray(fieldValue)) {
              formattedCommand[key] = fieldValue;
            } else {
              formattedCommand[key] = Object.entries(fieldValue).map(
                ([k, v]) => ({
                  key: k,
                  expression: v,
                })
              );
            }
          } else {
            formattedCommand[key] = fieldValue;
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
    if (flow?.deployedVersion && selectedVersion === "") {
      window.location.replace(
        `/${flowId}/${flow.deployedVersion}/${handlerId}`
      );
    }
  }, [flow]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const flowId = decodeURI(pathParts[1]);
    const version = decodeURI(pathParts[2]);
    const handlerId = decodeURI(pathParts[3]);
    flowIdRef.current = Number(flowId);
    setFlowId(Number(flowId));
    setHandlerId(handlerId);
    setSelectedVersion(version);

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
    commandRef.current = commands;
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
          <Title level={3} editable>
            {flow?.flowName}
          </Title>
        </Flex>
        <Flex align="center" gap={10}>
          <Button danger>Deploy</Button>
        </Flex>
      </Header>
      <Layout style={{ padding: "15px" }}>
        <Sider style={{ background: "none" }}>
          <Flex vertical gap={5}>
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
                  window.location.href = `/${flowId}/${e}/${handlerId}`;
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
                        (window.location.href = `/${flowId}/${selectedVersion}/${handler.handlerId}`)
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
              console.log("Creating new version", createModalValue);
            } else {
              createFlowHandler({
                flowId: flowIdRef.current,
                handlerName: createModalValue,
                definitionVersion: selectedVersion,
              });
              console.log("Creating new handler", createModalValue);
            }
          }}
        >
          <Form>
            <Form.Item
              label={createModalType === "version" ? "Version" : "Handler Name"}
            >
              <Input
                onChange={(e) => setCreateModalValue(e.target.value)}
                placeholder={
                  createModalType === "version"
                    ? "Version Name"
                    : "Handler Name"
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout>
  );
}

export default EditorLayout;
