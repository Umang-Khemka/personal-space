import axios from "axios";

const entryInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/entry"
      : "/api/v1/entry",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default entryInstance;