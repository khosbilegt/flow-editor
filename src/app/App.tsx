import { Button, Flex, Input, Layout, Typography } from "antd";
import FlowEditor from "../components/FlowEditor";
import "@xyflow/react/dist/style.css";
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Header, Content, Sider } = Layout;

const { Title } = Typography;

function App() {
  const [isTaskAscending, setTaskAscending] = useState(false);
  const [handlers, setHandlers] = useState([
    {
      id: 1,
      name: "Handler 1",
    },
    {
      id: 2,
      name: "Handler 2",
    },
    {
      id: 3,
      name: "Handler 3",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const sortHandlers = (ascending: boolean) => {
    const sortedHandlers = [...handlers].sort((a, b) => {
      if (ascending) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setHandlers(sortedHandlers);
    setTaskAscending(!ascending);
  };

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
            Flow Name
          </Title>
        </Flex>
        <Flex align="center" gap={10}>
          <Button type="primary">Save</Button>
          <Button danger>Deploy</Button>
        </Flex>
      </Header>
      <Layout style={{ padding: "15px" }}>
        <Sider style={{ background: "none" }}>
          <Flex vertical gap={5}>
            <Flex gap={5}>
              <Input
                placeholder="Search handler"
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
              <Button onClick={() => sortHandlers(isTaskAscending)}>
                {isTaskAscending ? (
                  <SortAscendingOutlined />
                ) : (
                  <SortDescendingOutlined />
                )}
              </Button>
            </Flex>
            {handlers.map((handler, index) => {
              if (searchTerm && !handler.name.includes(searchTerm)) {
                return null;
              }
              return (
                <Button key={index} style={{ width: "100%" }}>
                  {handler.name}
                </Button>
              );
            })}
          </Flex>
        </Sider>
        <Content
          style={{
            margin: "15px",
            border: "2px solid black",
            borderRadius: "12px",
          }}
        >
          <FlowEditor />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
