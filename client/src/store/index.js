import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projects-slice";
import projectReducer from "./project-slice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    project: projectReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
