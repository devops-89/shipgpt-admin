
import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice";
import crewReducer from "./slices/crewSlice";
import superintendentReducer from "./slices/superintendentSlice";
import userReducer from "./slices/userSlice";
import shipReducer from "./slices/shipSlice";

export const store = configureStore({
    reducer: {
        admin: adminReducer,
        crew: crewReducer,
        superintendent: superintendentReducer,
        user: userReducer,
        ship: shipReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
