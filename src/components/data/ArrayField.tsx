import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Input } from "antd";

function ArrayField({
  items,
  setItems,
}: {
  items: any[];
  setItems: (items: any[]) => void;
}) {
  return (
    <Flex>
      {items.map((item, index) => {
        return <Input />;
      })}
      <Button type="primary" icon={<PlusCircleOutlined />}>
        Add Field
      </Button>
    </Flex>
  );
}

export default ArrayField;
