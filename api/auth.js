
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
  createCrew: async (data) => {
    try {
      let result = await securedApi.post("/crew", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  createSuperintendent: async (data) => {
    try {
      let result = await securedApi.post("/super-intendent", data);
      return result;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (id, role) => {
    try {
      let result = await securedApi.get(`/users/${id}`, { params: { user_role: role } });
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (id, data) => {
    try {
      let result = await securedApi.patch(`/users/${id}`, data);
      return result;
    } catch (error) {
      throw error;
    }
  },

};


