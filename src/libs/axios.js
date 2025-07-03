import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  transformResponse: [
    (data) => {
      const json = JSON.parse(data);
      return json.data || json;
    },
  ],
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
