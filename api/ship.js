import { shippublicApi, shipsecuredApi } from "./config";
export const shipControllers = {
    createShip: async (data) => {
        console.log("Trace: calling createShip");
        try {
            let result = await shipsecuredApi.post("/ships/create", data)
            console.log("ship created raw:", result.data)
            return result
        }
        catch (error) {
            throw error
        }
    },
    getShips: async (data) => {
        try {
            let result = await shipsecuredApi.get("/ships/all", { params: data })
            console.log("ship fetched raw:", result.data)
            return result
        }
        catch (error) {
            throw error
        }
    },
    getShipById: async (id) => {
        try {
            let result = await shipsecuredApi.get(`/ships/${id}`)
            console.log("ship details fetched raw:", result.data)
            return result
        }
        catch (error) {
            throw error
        }
    },
    updateShip: async (id, data) => {
        try {
            let result = await shipsecuredApi.patch(`/ships/${id}`, data)
            console.log("ship updated raw:", result.data)
            return result
        }
        catch (error) {
            throw error
        }
    },
    deleteShip: async (id) => {
        try {
            let result = await shipsecuredApi.delete(`/ships/${id}`)
            console.log("ship deleted raw:", result.data)
            return result
        }
        catch (error) {
            throw error
        }
    },
    uploadPdf: async (formData) => {
        console.log("Trace: calling uploadPdf");
        try {
            let result = await shipsecuredApi.post("/ingestion/pdf", formData);
            console.log("pdf uploaded raw:", result.data);
            return result;
        } catch (error) {
            throw error;
        }
    }
};

