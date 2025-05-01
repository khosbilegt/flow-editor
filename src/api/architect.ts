import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Flow } from "@/schema/api";

export const architectAPI = createApi({
  reducerPath: "architectAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/public",
  }),
  endpoints: (build) => ({
    getFlowById: build.query<Flow, string>({
      query: (flowId) => `/flow/${flowId}`,
    }),
    getFlowDefinitionById: build.query<any, string>({
      query: (definitionId) => `/flow/${definitionId}/definition`,
    }),
  }),
});

export const { useGetFlowByIdQuery } = architectAPI;
