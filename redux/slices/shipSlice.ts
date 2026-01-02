
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { shipControllers } from "@/api/ship";

export const fetchShips = createAsyncThunk(
    "ship/fetchShips",
    async (_, { rejectWithValue }) => {
        try {
            const response = await shipControllers.getShips();
            return response.data.data.docs;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch ships");
        }
    }
);

export const createShip = createAsyncThunk(
    "ship/createShip",
    async (shipData: any, { rejectWithValue }) => {
        try {
            const response = await shipControllers.createShip(shipData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create ship");
        }
    }
);

export const fetchShipDetails = createAsyncThunk(
    "ship/fetchShipDetails",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await shipControllers.getShipById(id);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch ship details");
        }
    }
);

interface ShipState {
    ships: any[];
    selectedShip: any | null;
    loading: boolean;
    error: string | null;
    createLoading: boolean;
}

const initialState: ShipState = {
    ships: [],
    selectedShip: null,
    loading: false,
    error: null,
    createLoading: false,
};

const shipSlice = createSlice({
    name: "ship",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedShip: (state) => {
            state.selectedShip = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Ships
            .addCase(fetchShips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShips.fulfilled, (state, action) => {
                state.loading = false;
                state.ships = action.payload;
            })
            .addCase(fetchShips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Ship
            .addCase(createShip.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createShip.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createShip.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            })
            // Fetch Ship Details
            .addCase(fetchShipDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShipDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedShip = action.payload;
            })
            .addCase(fetchShipDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearSelectedShip } = shipSlice.actions;
export default shipSlice.reducer;
