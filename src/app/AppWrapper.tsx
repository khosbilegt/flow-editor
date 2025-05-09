import { useEffect, useState } from "react";
import App from "./App";
import AuthProvider from "./AuthProvider";
import AuthConfig from "../api/AuthConfig.json";

const authEnv: keyof typeof AuthConfig = import.meta.env
  .VITE_REACT_APP_AUTH_CONFIG as keyof typeof AuthConfig;

function AppWrapper() {
  const [flowId, setFlowId] = useState(1);
  const [version, setVersion] = useState("");
  const [handlerId, setHandlerId] = useState("MAIN");

  const navigateTo = (flowId: number, version: string, handlerId: string) => {
    const path = `/${flowId}/${version}/${handlerId}`;
    window.history.replaceState({}, "", path);
    setFlowId(flowId);
    setVersion(version);
    setHandlerId(handlerId);
  };

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const flowId = decodeURI(pathParts[1]);
    const version = decodeURI(pathParts[2]);
    const handlerId = decodeURI(pathParts[3]);

    if (flowId) {
      setFlowId(parseInt(flowId));
    }
    if (version) {
      setVersion(version);
    }
    if (handlerId) {
      setHandlerId(handlerId);
    }
  }, []);

  return (
    <AuthProvider config={AuthConfig[authEnv]}>
      <App
        flowId={flowId}
        initialVersion={version}
        initialHandlerId={handlerId}
        navigateTo={navigateTo}
      />
    </AuthProvider>
  );
}

export default AppWrapper;
