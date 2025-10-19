import axiosInstance from "./axiosInterceptor";

interface RegisterUser {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}
interface Login {
  email: string;
  password: string;
}
const path = "users";

const registerUser = async (data: RegisterUser) => {
  try {
    const response = await axiosInstance.post(path + "/register", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

const login = async (data: Login) => {
  try {
    const response = await axiosInstance.post("auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};
const chatServiceTest = async (data: string) => {
  try {
    const response = await axiosInstance.post("chat", { prompt: data }); // 👈 wrap trong object
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export { registerUser, login, chatServiceTest };
