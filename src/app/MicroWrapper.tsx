import { createStore } from "./store";
import { Provider } from "react-redux";
import App from "./App";

function MicroWrapper({
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
  const store = createStore(true);

  return (
    <Provider store={store}>
      <App
        flowId={flowId}
        initialVersion={initialVersion}
        initialHandlerId={initialHandlerId}
        navigateTo={navigateTo}
      />
    </Provider>
  );
}

export default MicroWrapper;
