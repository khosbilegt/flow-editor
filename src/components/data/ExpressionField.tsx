import { FlowValidationError } from "@/schema/architect";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Flex, Input, message, Typography } from "antd";
import jsonata from "jsonata";

const { Search } = Input;

function ExpressionField({
    value,
    setValue,
    error,
}: {
    value: string;
    setValue: (value: string) => void;
    error?: FlowValidationError | null | undefined;
}) {
    const [messageAPI, contextHolder] = message.useMessage();
    return (
        <Flex vertical gap={2}>
            {contextHolder}
            <Search
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                enterButton={<Button type="primary" icon={<CheckOutlined />} onClick={() => {
                    try {
                        jsonata(value).evaluate({}).then((result) => {
                            messageAPI.success("Valid expression. Result: " + result.toString());
                        })
                        .catch((err) => {
                            messageAPI.error("Invalid expression. Please validate with https://try.jsonata.org/: " +err.message);
                        })
                    } catch (err) {
                        messageAPI.error("Invalid expression. Please validate with https://try.jsonata.org/");
                    }
                }}/>}
                status={error !== null && error !== undefined ? "error" : undefined}
            />
            <Typography.Text type="secondary">
                This is an expression field. You can use the <a href="https://try.jsonata.org/" target="_blank">JSONata</a> language to define the value.
            </Typography.Text>
        </Flex>
    );
}

export default ExpressionField;
