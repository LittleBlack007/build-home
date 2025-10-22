// src/utils/request.js
import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 基础 URL
  timeout: 10000, // 请求超时时间
  headers: { "Content-Type": "application/json" }, // 默认请求头
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      console.error(res.message || "请求失败");
      return Promise.reject(res);
    }
    return res.data;
  },
  (error) => {
    console.error("网络错误", error);
    return Promise.reject(error);
  }
);

export default service;
