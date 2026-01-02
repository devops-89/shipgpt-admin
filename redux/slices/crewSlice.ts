
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

export const fetchCrew = createAsyncThunk(
    "crew/fetchCrew",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authControllers.getUsers({ user_role: "CREW" });
            return response.data.data.docs;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch crew");
        }
    }
);

export const createCrew = createAsyncThunk(
    "crew/createCrew",
    async (crewData: any, { rejectWithValue }) => {
        try {
            const response = await authControllers.createCrew(crewData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create crew member"); // Access specific error message if possible
        }
    }
);

interface CrewState {
    crew: any[];
    loading: boolean;
    error: string | null;
    createLoading: boolean;
}

const initialState: CrewState = {
    crew: [],
    loading: false,
    error: null,
    createLoading: false,
};

const crewSlice = createSlice({
    name: "crew",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCrew.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCrew.fulfilled, (state, action) => {
                state.loading = false;
                state.crew = action.payload;
            })
            .addCase(fetchCrew.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createCrew.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createCrew.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createCrew.rejected, (state, action) => {
                state.createLoading = false;
                // Check if payload is an object (validation errors) or string
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = crewSlice.actions;
export default crewSlice.reducer;
