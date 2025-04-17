import { Flex } from "antd";
import FlowEditor from "../components/FlowEditor";
import "@xyflow/react/dist/style.css";

function App() {
  return (
    <Flex
      style={{
        height: "90vh",
      }}
    >
      <Flex style={{ height: "100%", width: "100%" }}>
        <FlowEditor />
      </Flex>
    </Flex>
  );
}

export default App;
