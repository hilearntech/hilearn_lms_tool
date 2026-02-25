
import api from "./api";

// REGISTER
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  //  save auth data
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

// FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (token, password) => {
  const res = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  return res.data;
};

//  SEND OTP
export const sendOtp = async (email) => {
  const res = await api.post("/auth/send-otp", { email }); 
  return res.data;
};

//  VERIFY OTP
export const verifyOtp = async (data) => {
  const res = await api.post("/auth/verify-otp", data); 
  return res.data;
};
