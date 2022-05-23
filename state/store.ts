import { configureStore } from "@reduxjs/toolkit";

import notesReducer from "./notes_slice";
import lockReducer from "./lock_slice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    lock: lockReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
