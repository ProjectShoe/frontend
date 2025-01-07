import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { clientAPI } from "./api/client";

const refreshToken = async () => {
  try {
    const res = await clientAPI("post", "/employee/refreshToken");
    return res.accessToken;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createAxios = (user, dispatch, stateSuccess) => {
  const newInstance = axios.create();

  newInstance.interceptors.request.use(
    async (config) => {
      if (user?.accessToken) {
        const date = new Date();
        const decodedToken = jwtDecode(user.accessToken);

        if (decodedToken.exp < date.getTime() / 1000) {
          try {
            const newAccessToken = await refreshToken();
            const updatedUser = {
              ...user,
              accessToken: newAccessToken,
            };
            dispatch(stateSuccess(updatedUser));
            config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          } catch (error) {
            return Promise.reject(error);
          }
        } else {
          config.headers["Authorization"] = `Bearer ${user.accessToken}`;
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return newInstance;
};
