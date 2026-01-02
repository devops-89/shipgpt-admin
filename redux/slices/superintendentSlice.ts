
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

export const fetchSuperintendents = createAsyncThunk(
    "superintendent/fetchSuperintendents",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authControllers.getUsers({ user_role: "SUPERINTENDENT" });
            return response.data.data.docs;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch superintendents");
        }
    }
);

export const createSuperintendent = createAsyncThunk(
    "superintendent/createSuperintendent",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await authControllers.createSuperintendent(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create superintendent");
        }
    }
);

interface SuperintendentState {
    superintendents: any[];
    loading: boolean;
    error: string | null;
    createLoading: boolean;
}

const initialState: SuperintendentState = {
    superintendents: [],
    loading: false,
    error: null,
    createLoading: false,
};

const superintendentSlice = createSlice({
    name: "superintendent",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuperintendents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuperintendents.fulfilled, (state, action) => {
                state.loading = false;
                state.superintendents = action.payload;
            })
            .addCase(fetchSuperintendents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createSuperintendent.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createSuperintendent.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createSuperintendent.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = superintendentSlice.actions;
export default superintendentSlice.reducer;
