import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { store } from "../redux/store";
import { loginSuccess } from "../redux/slices/authSlice";

const baseURL = process.env.REACT_APP_BACKEND_API || "http://localhost:3001/";

const client = async (method, url, options = {}) => {
  if (!options) options = {};

  let urlencodedOptions = new URLSearchParams(
    Object.entries(options)
  ).toString();

  const { data } = await axios({
    baseURL,
    url,
    method,
    data: urlencodedOptions,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (method.toLowerCase() === "post") {
    if (data?.status === "OK") return data;
    else return data?.message;
  } else if (method.toLowerCase() === "get") {
    if (data?.status === "OK") return data;
    else if (data?.status === 500) return data?.message;
    else return data;
  } else if (method.toLowerCase() === "put") {
    if (data?.status === "OK") return data;
    else if (data?.status === 500) return data?.message;
    else return data;
  }
};
const refreshToken = async () => {
  try {
    const res = await client("post", "/employee/refreshToken");
    return res.accessToken;
  } catch (err) {
    console.log(err);
  }
};

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user?.accessToken) {

      config.headers["Authorization"] = `Bearer ${user.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Sử dụng axiosInstance cho clientAPI
const clientAPI = async (method, url, options = {}) => {
  let reqData;
  let headers = {
    Accept: "*/*",
  };

  if (options instanceof FormData) {
    reqData = options;
    headers["Content-Type"] = "multipart/form-data";
  } else if (
    typeof options === "object" &&
    !(options instanceof URLSearchParams)
  ) {
    reqData = JSON.stringify(options);
    headers["Content-Type"] = "application/json";
  } else {
    reqData = new URLSearchParams(Object.entries(options)).toString();
    headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const { data } = await axiosInstance({
    url,
    method,
    data: reqData,
    headers,
  });

  if (method.toLowerCase() === "post") {
    if (data?.status === "OK") return data;
    else return data?.message;
  } else if (method.toLowerCase() === "get") {
    if (data?.status === "OK") return data;
    else if (data?.status === 500) return data?.message;
    else return data;
  } else if (method.toLowerCase() === "put") {
    if (data?.status === "OK") return data;
    else if (data?.status === 500) return data?.message;
    else return data;
  } else if (method.toLowerCase() === "delete") {
    if (data?.status === "OK") return data;
    else if (data?.status === 500) return data?.message;
    else return data;
  }
};

export {
  clientAPI,
  axiosInstance
}