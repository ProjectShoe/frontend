import toast from "react-hot-toast";

const { clientAPI } = require("../client");
export const employeeCall = {
  getTotalAllUser: async (data) => {
    try {
      const response = await clientAPI("get", "/employee/getTotalAllUser");
      return response;
    } catch (error) {
      console.error("Create error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  getTotalStatusUser: async (data) => {
    try {
      const response = await clientAPI("get", "/employee/getTotalStatusUser");
      return response;
    } catch (error) {
      console.error("Create error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  getTotalUnStatusUser: async (data) => {
    try {
      const response = await clientAPI("get", "/employee/getTotalUnStatusUser");
      return response;
    } catch (error) {
      console.error("Create error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  getTotalNewUser: async (data) => {
    try {
      const response = await clientAPI("get", "/employee/getNewUser");
      return response;
    } catch (error) {
      console.error("Create error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await clientAPI("post", "/employee", data);
      return response;
    } catch (error) {
      console.error("Create error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await clientAPI("put", `/employee/${id}`, data);
      return response;
    } catch (error) {
      console.error("Update error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await clientAPI("delete", `/employee/${id}`);
      return response;
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  updateStatus: async (data) => {
    try {
      const response = await clientAPI("post", "/employee/adminUpdateStatus", {
        _id: data.id,
        status: data.status,
      });
      return response;
    } catch (error) {
      console.error("update error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  updatePassword: async (data) => {
    console.log({ data });
    try {
      const response = await clientAPI(
        "post",
        "/employee/adminUpdatePassword",
        {
          _id: data.id,
          password: data.password,
        }
      );
      return response;
    } catch (error) {
      console.error("update error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  checkCodeUnique: async (code) => {
    try {
      const response = await clientAPI("get", `/employee/code/${code}`);
      if (!response) {
        return true;
      }
      return false;
    } catch (error) {
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  get: async (id) => {
    try {
      const response = await clientAPI("get", `/employee/${id}`);
      return response;
    } catch (error) {
      console.error("Create error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  updatePasswordCurrent: async (data) => {
    try {
      const response = await clientAPI(
        "put",
        "/employee/updatePasswordWeb",
        data
      );
      return response;
    } catch (error) {
      console.error("update error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await clientAPI("post", "/employee/logout");
      return response;
    } catch (error) {
      console.error("update error:", error);
      const errorMessages = error?.response?.data?.errors?.map(
        (err) => err.message
      ) || [
        error?.response?.data?.message ||
          error?.response?.statusText ||
          error?.message ||
          "An unexpected error occurred.",
      ];

      errorMessages.forEach((message) => {
        toast.error(`${message}`);
      });
      throw error;
    }
  },
};
