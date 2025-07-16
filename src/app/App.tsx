import {
  FloatButton,
  Layout,
  message,
  Typography,
} from "antd";
import FlowEditor from "../components/FlowEditor";
import "@xyflow/react/dist/style.css";
import {
  SaveOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { FlowCommand, FlowHandler } from "@/schema/architect";
import { useDispatch } from "react-redux";
import {
  setFlowId,
  setHandlerId,
  setSelectedVersion,
} from "../context/FlowContext";

const { Content, Header } = Layout;


function App({
  flowId,
  initialVersion,
  initialHandlerId,
}: {
  flowId: number;
  initialVersion: string;
  initialHandlerId: string;
  navigateTo: (flowId: number, version: string, handlerId: string) => void;
}) {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  // -1 must not fetch.
  const flowIdRef = useRef<number>(-1);
  const commandsRef = useRef<FlowCommand[]>([]);
  const selectedHandlerRef = useRef<FlowHandler | undefined>(undefined);
  const keyboardListenerInitialized = useRef(false);
  const [commands, setCommands] = useState<FlowCommand[]>([]);

  const save = () => {
      let updatedDefinition: FlowHandler = {
        handlerId: initialHandlerId,
        handlerName: "Default Handler",
        initialCommandId: "",
        lastModifiedDate: new Date().toISOString(),
        errorCount: 0,
        referencedHandlers: [],
        commands: commandsRef.current ? commandsRef.current : [],
        definitionVersion: initialVersion,
      };
    messageApi.success("Flow saved successfully to Local Storage.");
    localStorage.setItem("flow", JSON.stringify(updatedDefinition));
  };

  useEffect(() => {
    flowIdRef.current = Number(flowId);
    const flow = localStorage.getItem("flow");
    if (flow) {
      const flowData = JSON.parse(flow);
      setCommands(flowData.commands);
    }
    dispatch(setFlowId(flowId));
    dispatch(setFlowId(Number(flowId)));
    dispatch(setHandlerId(initialHandlerId));
    dispatch(setSelectedVersion(initialVersion));
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
    commandsRef.current = commands;
  }, [commands]);

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      {contextHolder}
      <Layout style={{ padding: "15px" }}>
        <Header style={{background: "none", height: '50px', textAlign: 'center', borderBottom: '1px solid #000'}}>
          <Typography.Title level={5}>Mouse 1 to create a node</Typography.Title>
        </Header>
        <Content
          style={{
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
                <SaveOutlined height={100} width={100} />
            }
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
