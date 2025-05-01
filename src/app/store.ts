import { configureStore } from "@reduxjs/toolkit";
import { architectAPI } from "../api/architect"; // Import the architectAPI

export const store = configureStore({
  reducer: {
    [architectAPI.reducerPath]: architectAPI.reducer, // Add the architectAPI reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(architectAPI.middleware), // Add the architectAPI middleware
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
