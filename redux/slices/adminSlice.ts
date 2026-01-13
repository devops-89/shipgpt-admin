
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

// Async thunk to fetch admins
export const fetchAdmins = createAsyncThunk(
    "admin/fetchAdmins",
    async (_, { rejectWithValue }) => {
        try {
            const [activeResponse, inactiveResponse] = await Promise.all([
                authControllers.getUsers({ user_role: "ADMIN", isActive: true, limit: 1000 }),
                authControllers.getUsers({ user_role: "ADMIN", isActive: false, limit: 1000 })
            ]);

            const activeAdmins = activeResponse.data.data.docs || [];
            const inactiveAdmins = inactiveResponse.data.data.docs || [];

            const allAdmins = [...activeAdmins, ...inactiveAdmins];
            const uniqueAdmins = Array.from(new Map(allAdmins.map(item => [item._id || item.id, item])).values());

            return uniqueAdmins.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
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

export const updateAdminStatus = createAsyncThunk(
    "admin/updateAdminStatus",
    async ({ id, status }: { id: string | number; status: boolean }, { rejectWithValue }) => {
        try {
            const response = await authControllers.updateUser(id, { isActive: status, role: "ADMIN" });
            return { id, status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update admin status");
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
            })
            .addCase(updateAdminStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const adminIndex = state.admins.findIndex((admin) => (admin._id === id || admin.id === id));
                if (adminIndex !== -1) {
                    state.admins[adminIndex].isActive = status;
                    state.admins[adminIndex].status = status ? 'Active' : 'Inactive';
                }
            });
    },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
