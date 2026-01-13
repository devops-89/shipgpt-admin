
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

export const fetchSuperintendents = createAsyncThunk(
    "superintendent/fetchSuperintendents",
    async (_, { rejectWithValue }) => {
        try {
            const [activeResponse, inactiveResponse] = await Promise.all([
                authControllers.getUsers({ user_role: "SUPERINTENDENT", isActive: true, limit: 1000 }),
                authControllers.getUsers({ user_role: "SUPERINTENDENT", isActive: false, limit: 1000 })
            ]);

            const activeSuperintendents = activeResponse.data.data.docs || [];
            const inactiveSuperintendents = inactiveResponse.data.data.docs || [];

            const allSuperintendents = [...activeSuperintendents, ...inactiveSuperintendents];
            const uniqueSuperintendents = Array.from(new Map(allSuperintendents.map(item => [item._id || item.id, item])).values());

            return uniqueSuperintendents.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
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
            })
            .addCase(updateSuperintendentStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const index = state.superintendents.findIndex((s) => (s._id === id || s.id === id));
                if (index !== -1) {
                    state.superintendents[index].isActive = status;
                    state.superintendents[index].status = status ? 'Active' : 'Inactive';
                }
            });
    },
});

export const updateSuperintendentStatus = createAsyncThunk(
    "superintendent/updateSuperintendentStatus",
    async ({ id, status }: { id: string | number; status: boolean }, { rejectWithValue }) => {
        try {
            const response = await authControllers.updateUser(id, { isActive: status, role: "SUPERINTENDENT" });
            return { id, status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update superintendent status");
        }
    }
);

export const { clearError } = superintendentSlice.actions;
export default superintendentSlice.reducer;
