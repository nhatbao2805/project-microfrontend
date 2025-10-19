import axiosInstance from "./axiosInterceptor";

const BASE_PATH = "invoices";

export interface CreateInvoiceDto {
  title: string;
  amount: number;
  category?: string;
  note?: string;
  invoiceDate: string;
  dueDate?: string;
  isPaid?: boolean;
}

export const createInvoice = async (data: CreateInvoiceDto) => {
  try {
    const response = await axiosInstance.post(`${BASE_PATH}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (
  id: string,
  data: Partial<CreateInvoiceDto>
) => {
  try {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
