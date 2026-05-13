import axios from "axios";

const api = axios.create({ baseURL: "/api/sensor" });

export const fetchLatest = () => api.get("/latest").then((r) => r.data);
export const fetchHistory = (limit = 50) =>
  api.get(`/history?limit=${limit}`).then((r) => r.data);
export const fetchAlerts = (limit = 100) =>
  api.get(`/alerts?limit=${limit}`).then((r) => r.data);
export const fetchPrediction = (fruit) =>
  api.get(`/prediction?fruit_type=${fruit}`).then((r) => r.data);
export const manualPredict = (payload) =>
  api.post("/predict", payload).then((r) => r.data);
