import { useEffect, useState } from "react";
import App from "./App";
import { Provider } from "react-redux";
import { createStore } from "./store";

function AppWrapper() {
  const [flowId, setFlowId] = useState(1);
  const [version, setVersion] = useState("");
  const [handlerId, setHandlerId] = useState("MAIN");

  const navigateTo = (flowId: number, version: string, handlerId: string) => {
    const path = `/${flowId}/${version}/${handlerId}`;
    window.location.href = path;
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

  const store = createStore(false);

  return (
    <Provider store={store}>
      <App
        flowId={flowId}
        initialVersion={version}
        initialHandlerId={handlerId}
        navigateTo={navigateTo}
      />
    </Provider>
  );
}

export default AppWrapper;
