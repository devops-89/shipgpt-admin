
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

// Async thunk to fetch admins
export const fetchAdmins = createAsyncThunk(
    "admin/fetchAdmins",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authControllers.getUsers({ user_role: "ADMIN" });
            return response.data.data.docs;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch admins");
        }
    }
);


export const createAdmin = createAsyncThunk(
    "admin/createAdmin",
    async (adminData: any, { rejectWithValue }) => {
        try {
            const response = await authControllers.createAdmin(adminData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create admin");
        }
    }
);

interface AdminState {
    admins: any[];
    loading: boolean;
    error: string | null;
    createLoading: boolean;
}

const initialState: AdminState = {
    admins: [],
    loading: false,
    error: null,
    createLoading: false,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Admins
        builder
            .addCase(fetchAdmins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmins.fulfilled, (state, action) => {
                state.loading = false;
                state.admins = action.payload;
            })
            .addCase(fetchAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Create Admin
        builder
            .addCase(createAdmin.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createAdmin.fulfilled, (state, action) => {
                state.createLoading = false;
                
            })
            .addCase(createAdmin.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
