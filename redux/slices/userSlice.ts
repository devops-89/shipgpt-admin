
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authControllers.getUsers({ limit: 1000 });
            const allUsers = response.data.data.docs || [];

            return allUsers.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
        }
    }
);

interface UserState {
    users: any[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((user) => user.id === action.payload.data._id || user._id === action.payload.data._id);
                if (index !== -1) {
                    state.users[index] = action.payload.data;
                }
            });
    },
});

export const updateUser = createAsyncThunk(
    "user/updateUser",
    async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
        try {
            const response = await authControllers.updateUser(id, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update user");
        }
    }
);

export const changePassword = createAsyncThunk(
    "user/changePassword",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await authControllers.changePassword(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to change password");
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "user/forgotPassword",
    async (data: { email: string }, { rejectWithValue }) => {
        try {
            // Trimming and Lowercasing to avoid any case-sensitivity issues on server
            const sanitizedEmail = data.email.trim().toLowerCase();
            const response = await authControllers.forgotPassword({ email: sanitizedEmail });

            // Critical check: if server says success: false despite 200 status
            if (response.data && response.data.success === false) {
                return rejectWithValue(response.data.message || "Server accepted request but failed to fire email");
            }

            return response.data;
        } catch (error: any) {
            console.error("Forgot Password Thunk Error:", error.response?.data);
            const errorData = error.response?.data;
            const message = errorData?.message || errorData?.errors?.[0] || errorData?.error || "Connection/Backend issue";
            return rejectWithValue(message);
        }
    }
);

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
