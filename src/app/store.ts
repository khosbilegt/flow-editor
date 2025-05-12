import { configureStore } from "@reduxjs/toolkit";
import { architectAPI } from "../api/architect";
import flowReducer from "../context/FlowContext";

export const createStore = (isMicro: boolean = true) => {
  return configureStore({
    reducer: {
      [architectAPI.reducerPath]: architectAPI.reducer,
      flow: flowReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { isMicro },
        },
      }).concat(architectAPI.middleware),
  });
};

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<
  ReturnType<typeof createStore>["dispatch"]
>;
