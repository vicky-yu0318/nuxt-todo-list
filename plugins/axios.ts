import { defineNuxtPlugin } from "#app";
import axios from "axios";

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: "http://localhost:3004", // JSON Server 地址
  });

  return {
    provide: {
      axios: instance,
    },
  };
});
