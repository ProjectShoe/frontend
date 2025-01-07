import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
} from "./authSlice";
// import {
//   deleteUserFailed,
//   deleteUsersSuccess,
//   deleteUserStart,
//   getUsersFailed,
//   getUsersStart,
//   getUsersSuccess,
// } from "./userSlice";
import { clientAPI } from "../../api/client";
import toast from "react-hot-toast";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await clientAPI("post", "/auth/signin", user);
    console.log("res", res?.data);
    localStorage.setItem("user", JSON.stringify(res))
    dispatch(loginSuccess(res?.data));
    navigate("/");
    toast.success("Đăng nhập thành công");
  } catch (err) {
    dispatch(loginFailed());
    if (err.response) {
      const statusCode = err.response.status;
      const message = err.response.data.message;

      if (statusCode === 403) {
        toast.error("Không có quyền truy cập");
      } else if (statusCode === 404) {
        toast.error("Tài khoản không tồn tại!");
      } else if (statusCode === 401) {
        toast.error("Mật khẩu không chính xác!");
      } else {
        toast.error("Đăng nhập thất bại");
      }

      console.log({ message: message, status: statusCode });
    } else {
      toast.error("Đăng nhập thất bại");
      console.log({ message: err.message });
    }
  }
};

export const logOut = async (dispatch, navigate) => {
  dispatch(logOutStart());
  try {
    const res = await clientAPI("post", "/auth/logout");
    dispatch(logOutSuccess());
    navigate("/login");
    toast.success("Đăng xuất thành công");
  } catch (err) {
    dispatch(logOutFailed());
  }
};
