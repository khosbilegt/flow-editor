import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Flow, FlowCommand, FlowHandler } from "@/schema/architect";

export const architectAPI = createApi({
  reducerPath: "architectAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/public",
  }),
  tagTypes: ["Flow", "FlowHandler", "FlowHandlerList"],
  endpoints: (build) => ({
    getFlowById: build.query<Flow, number>({
      query: (flowId) => `/flow/${flowId}`,
      providesTags: (_) => {
        return ["Flow"];
      },
    }),
    listFlowVersion: build.query<Flow[], number>({
      query: (flowId) => `/flow/${flowId}/version`,
      providesTags: (_) => {
        return ["Flow"];
      },
    }),
    listFlowHandlers: build.query<
      FlowHandler[],
      { flowId: number; version: string }
    >({
      query: (data: { flowId: number; version: string }) =>
        `/flow/${data.flowId}/handler/list?version=${data.version}`,
      providesTags: (_) => {
        return ["Flow", "FlowHandler", "FlowHandlerList"];
      },
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
      providesTags: (_) => {
        return ["Flow", "FlowHandler"];
      },
      transformResponse: (response: any) => {
        const tempCommands: FlowCommand[] = [];
        Object.keys(response?.commands ? response?.commands : {}).forEach(
          (key) => {
            let command = response?.commands[key];
            let fields: Record<string, any> = {};
            let edges: Record<string, any> = {};
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
                if (fieldKey.startsWith("on")) {
                  edges[fieldKey] = {
                    id: fieldKey,
                    type: "flow",
                    target: command[fieldKey],
                  };
                } else {
                  if (command[fieldKey] && Array.isArray(command[fieldKey])) {
                    let tempFieldMap: any = {};
                    let tempFieldArray: any[] = [];
                    command[fieldKey].forEach((item: any) => {
                      if (item.key && item.expression) {
                        tempFieldMap[item.key] = item.expression;
                      } else {
                        tempFieldArray.push(item);
                      }
                    });
                    if (tempFieldArray.length > 0) {
                      fields[fieldKey] = tempFieldArray;
                    } else {
                      fields[fieldKey] = tempFieldMap;
                    }
                  } else {
                    fields[fieldKey] = command[fieldKey];
                  }
                }
                delete command[fieldKey];
              }
            });
            command["fields"] = fields;
            command["edges"] = edges;
            tempCommands.push(command);
          }
        );
        const transformedResponse = {
          ...response,
          commands: tempCommands,
        };
        return transformedResponse;
      },
    }),
    createFlowHandler: build.mutation<
      {
        status: string;
        message: string;
        data: FlowHandler;
      },
      {
        flowId: number;
        handlerName: string;
        definitionVersion: string;
      }
    >({
      query: (data: {
        flowId: number;
        handlerName: string;
        definitionVersion: string;
      }) => ({
        url: `/flow/${data.flowId}/handler`,
        method: "POST",
        body: {
          handlerName: data.handlerName,
          definitionVersion: data.definitionVersion,
        },
      }),
      invalidatesTags: (_) => {
        return ["FlowHandlerList"];
      },
    }),
    updateFlowHandler: build.mutation<
      FlowHandler,
      {
        flowId: number;
        data: FlowHandler;
      }
    >({
      query: (data: { flowId: number; data: FlowHandler }) => ({
        url: `/flow/${data.flowId}/handler`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: (_) => {
        return ["FlowHandler"];
      },
    }),
    deleteFlowHandler: build.mutation<
      {
        status: string;
        message: string;
      },
      {
        flowId: number;
        handlerId: string;
        version: string;
      }
    >({
      query: (data: {
        flowId: number;
        handlerId: string;
        version: string;
      }) => ({
        url: `/flow/${data.flowId}/handler?handlerId=${data.handlerId}&version=${data.version}`,
        method: "DELETE",
      }),
      invalidatesTags: (_) => {
        return ["FlowHandlerList"];
      },
    }),
  }),
});

export const {
  useGetFlowByIdQuery,
  useGetFlowHandlerByIdQuery,
  useListFlowHandlersQuery,
  useListFlowVersionQuery,
  useCreateFlowHandlerMutation,
  useUpdateFlowHandlerMutation,
  useDeleteFlowHandlerMutation,
} = architectAPI;
