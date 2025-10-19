import axiosInstance from "./axiosInterceptor";
const BASE_PATH = "ai";

export const createInvoiceWithImage = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_PATH}/createInvoice`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};
