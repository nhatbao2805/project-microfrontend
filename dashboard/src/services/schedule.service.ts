import axiosInstance from "./axiosInterceptor";

const BASE_PATH = "schedule";

export interface CreateScheduleDto {
  date: string;
  title: string;
  description?: string;
  meetingLink?: string;
  startAt: string;
  endAt: string;
  isDone?: boolean;
}

export const createSchedule = async (data: CreateScheduleDto) => {
  try {
    const response = await axiosInstance.post(`${BASE_PATH}`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const getSchedules = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }
};

export const updateSchedule = async (
  id: string,
  data: Partial<CreateScheduleDto>
) => {
  try {
    const response = await axiosInstance.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${BASE_PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};
