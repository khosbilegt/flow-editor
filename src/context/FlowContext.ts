import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FlowState {
  flowId: number;
  handlerId: string;
  selectedVersion: string;
  [key: string]: string | number;
}

const initialState: FlowState = {
  flowId: -1,
  handlerId: "MAIN",
  selectedVersion: "",
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setFlowId(state, action: PayloadAction<number>) {
      state.flowId = action.payload;
    },
    setHandlerId(state, action: PayloadAction<string>) {
      state.handlerId = action.payload;
    },
    setSelectedVersion(state, action: PayloadAction<string>) {
      state.selectedVersion = action.payload;
    },
  },
});

export const { setFlowId, setHandlerId, setSelectedVersion } =
  flowSlice.actions;

export type { FlowState };

export default flowSlice.reducer;
