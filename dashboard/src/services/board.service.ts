import axiosInstance from './axiosInterceptor';

interface LoginCredentials {
  email: string;
  password: string;
}

const BASE_PATH = 'boards';

export const createBoard = async (name: string) => {
  try {
    const response = await axiosInstance.post(`${BASE_PATH}`, { name });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getDetailBoard = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getListBoard = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}`);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
