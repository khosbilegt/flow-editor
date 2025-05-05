import { configureStore } from "@reduxjs/toolkit";
import { architectAPI } from "../api/architect";
import flowReducer from "../context/FlowContext";

export const store = configureStore({
  reducer: {
    [architectAPI.reducerPath]: architectAPI.reducer,
    flow: flowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(architectAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
