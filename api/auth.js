
import { publicApi, securedApi } from "./config";
export const authControllers = {
  login: async (data) => {
    try {
      let result = await publicApi.post("/login", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  createAdmin: async (data) => {
    try {
      let result = await securedApi.post("/admin", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getUsers: async (params) => {
    try {
      let result = await securedApi.get("/users", { params });
      return result;
    } catch (error) {
      throw error;
    }
  },
};


