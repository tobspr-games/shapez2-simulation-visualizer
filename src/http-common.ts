import axios, { AxiosInstance, AxiosResponse } from "axios";
import ResponseData from "@/types/ResponseData";

const baseURL = "https://api.github.com";

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-type": "application/json",
  },
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Response interceptor
http.interceptors.response.use(
  async (response: AxiosResponse) => {
    const res: ResponseData = response;
    const { status } = res;

    // Custom status code validation
    if (status !== 200) {
      return Promise.reject({
        response,
        message: "CustomError",
      });
    }

    return res.data;
  },
  // export default catch
  (error) => {
    if (error.response && error.response.data) {
      console.error(`[Axios Error]`, error.response);
    }
  },
);

export default http;
