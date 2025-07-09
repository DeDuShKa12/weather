import { combineReducers, configureStore } from "@reduxjs/toolkit";

import weatherSlice from "./slices/weatherSlice";

const rootReducer = combineReducers({
  weatherSlice,
});

type RootState = ReturnType<typeof rootReducer>;
type AppStore = ReturnType<typeof setupStore>;
type AppDispatch = AppStore["dispatch"];

const setupStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type { RootState, AppStore, AppDispatch };

export { setupStore };
