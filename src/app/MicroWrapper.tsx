import { createStore } from "./store";
import { Provider } from "react-redux";
import App from "./App";

function MicroWrapper({
  flowId,
  initialVersion,
  initialHandlerId,
  navigateTo,
}: {
  flowId?: number;
  initialVersion?: string;
  initialHandlerId?: string;
  navigateTo?: (flowId: number, version: string, handlerId: string) => void;
}) {
  const store = createStore(true);

  return (
    <Provider store={store}>
      <App
        flowId={flowId ? flowId : 1}
        initialVersion={initialVersion ? initialVersion : "Initial"}
        initialHandlerId={initialHandlerId ? initialHandlerId : "Main"}
        navigateTo={navigateTo ? navigateTo : () => {}}
      />
    </Provider>
  );
}

export default MicroWrapper;
