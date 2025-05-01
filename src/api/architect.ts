import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Flow, FlowCommand, FlowHandler } from "@/schema/architect";

export const architectAPI = createApi({
  reducerPath: "architectAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/public",
  }),
  endpoints: (build) => ({
    getFlowById: build.query<Flow, number>({
      query: (flowId) => `/flow/${flowId}`,
    }),
    listFlowHandlers: build.query<
      FlowHandler[],
      { flowId: number; version: string }
    >({
      query: (data: { flowId: number; version: string }) =>
        `/flow/${data.flowId}/handler/list?version=${data.version}`,
    }),
    getFlowHandlerById: build.query<
      FlowHandler,
      {
        flowId: number;
        handlerId: string;
        version: string;
      }
    >({
      query: (data: { flowId: number; handlerId: string; version: string }) =>
        `/flow/${data.flowId}/handler?handlerId=${data.handlerId}&version=${data.version}`,
      transformResponse: (response: any) => {
        const tempCommands: FlowCommand[] = [];
        Object.keys(response?.commands).forEach((key) => {
          let command = response?.commands[key];
          let fields: Record<string, any> = {};
          Object.keys(command).forEach((fieldKey) => {
            if (
              ![
                "id",
                "name",
                "type",
                "positionX",
                "positionY",
                "fields",
                "edges",
                "errors",
              ].includes(fieldKey)
            ) {
              fields[fieldKey] = command[fieldKey];
              delete command[fieldKey];
            }
          });
          command["fields"] = fields;
          tempCommands.push(command);
        });
        const transformedResponse = {
          ...response,
          commands: tempCommands,
        };
        return transformedResponse;
      },
    }),
    listFlowVersion: build.query<Flow[], number>({
      query: (flowId) => `/flow/${flowId}/version`,
    }),
  }),
});

export const {
  useGetFlowByIdQuery,
  useGetFlowHandlerByIdQuery,
  useListFlowHandlersQuery,
  useListFlowVersionQuery,
} = architectAPI;
