
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authControllers } from "@/api/auth";

export const fetchCrew = createAsyncThunk(
    "crew/fetchCrew",
    async (_, { rejectWithValue }) => {
        try {
            const [activeResponse, inactiveResponse] = await Promise.all([
                authControllers.getUsers({ user_role: "CREW", isActive: true, limit: 1000 }),
                authControllers.getUsers({ user_role: "CREW", isActive: false, limit: 1000 })
            ]);

            const activeCrew = activeResponse.data.data.docs || [];
            const inactiveCrew = inactiveResponse.data.data.docs || [];

            const allCrew = [...activeCrew, ...inactiveCrew];
            const uniqueCrew = Array.from(new Map(allCrew.map(item => [item._id || item.id, item])).values());

            return uniqueCrew.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
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
            return rejectWithValue(error.response?.data?.message || "Failed to create crew member");
        }
    }
);

export const updateCrewStatus = createAsyncThunk(
    "crew/updateCrewStatus",
    async ({ id, status }: { id: string | number; status: boolean }, { rejectWithValue }) => {
        try {
            const response = await authControllers.updateUser(id, { isActive: status, role: "CREW" });
            return { id, status };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update crew status");
        }
    }
);

interface CrewState {
    crew: any[];
    selectedCrewDetails: any | null;
    loading: boolean;
    detailsLoading: boolean;
    error: string | null;
    createLoading: boolean;
}

const initialState: CrewState = {
    crew: [],
    selectedCrewDetails: null,
    loading: false,
    detailsLoading: false,
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

                state.error = action.payload as string;
            })
            .addCase(fetchCrewDetails.pending, (state) => {
                state.detailsLoading = true;
                state.error = null;
            })
            .addCase(fetchCrewDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.selectedCrewDetails = action.payload;
            })
            .addCase(fetchCrewDetails.rejected, (state, action) => {
                state.detailsLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCrewStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const index = state.crew.findIndex((c) => (c._id === id || c.id === id));
                if (index !== -1) {
                    state.crew[index].isActive = status;
                    state.crew[index].status = status ? 'Active' : 'Inactive';
                }
            });
    },
});

export const fetchCrewDetails = createAsyncThunk(
    "crew/fetchCrewDetails",
    async ({ id, role }: { id: string | number; role: string }, { rejectWithValue }) => {
        try {
            const response = await authControllers.getUserById(id, role);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch crew details");
        }
    }
);

export const { clearError } = crewSlice.actions;
export default crewSlice.reducer;
