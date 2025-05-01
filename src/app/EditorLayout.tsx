import {
  Button,
  Flex,
  FloatButton,
  Input,
  Layout,
  Select,
  Spin,
  Typography,
} from "antd";
import FlowEditor from "../components/FlowEditor";
import "@xyflow/react/dist/style.css";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import {
  useGetFlowByIdQuery,
  useGetFlowHandlerByIdQuery,
  useListFlowHandlersQuery,
  useListFlowVersionQuery,
} from "../api/architect";

const { Search } = Input;

const { Header, Content, Sider } = Layout;

const { Title } = Typography;

function EditorLayout() {
  // -1 must not fetch.
  const [flowId, setFlowId] = useState<number>(-1);
  const [handlerId, setHandlerId] = useState<string>("MAIN");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const keyboardListenerInitialized = useRef(false);
  const [isSaving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: flow } = useGetFlowByIdQuery(flowId, {
    skip: flowId === -1,
  });

  const { data: handlers } = useListFlowHandlersQuery(
    { flowId, version: selectedVersion },
    {
      skip: flowId === -1 || selectedVersion === "",
    }
  );

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
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 2000);
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
              <Button type="primary" icon={<PlusOutlined />} />
            </Flex>
            <Search
              placeholder="Search handler"
              onChange={(e) => setSearchTerm(e?.target?.value)}
              allowClear
              enterButton
            />
            {handlers
              ?.slice() // Create a shallow copy of the array to avoid mutating the original
              .sort((a, b) => {
                // Ensure "Main Handler" is always first
                if (a.handlerId === "MAIN") return -1;
                if (b.handlerId === "MAIN") return 1;

                // Otherwise, sort alphabetically by handlerName
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
                  <Button
                    key={index}
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
          <FlowEditor handler={selectedHandler} />
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
      </Layout>
    </Layout>
  );
}

export default EditorLayout;
