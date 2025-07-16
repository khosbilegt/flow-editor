import { useState } from "react";
import { BaseCommandSchema, commandList } from "../schema/generic";
import { Card, Flex, Input, List, Typography } from "antd";

const { Search } = Input;
const { Title, Text } = Typography;

function FlowCommands({
  createNode,
}: {
  createNode: (schema: BaseCommandSchema) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCommandList = commandList.filter((schema) =>
    schema.command.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Flex vertical gap={10}>
      <Search
        enterButton
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 2,
        }}
        dataSource={filteredCommandList}
        renderItem={(schema) => {
          return (
            <List.Item key={schema.command}>
              <Card
                style={{ padding: 0, margin: 0 }}
                onClick={() => {
                  createNode(schema);
                }}
              >
                <Title level={4}>{schema.command}</Title>
                <Text type="secondary">{schema?.description}</Text>
              </Card>
            </List.Item>
          );
        }}
      ></List>
    </Flex>
  );
}

export default FlowCommands;
