import { createI18n } from "vue-i18n";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    // locale: localStorage.getItem("locale") || "zh",
    locale: "zh",
    messages: {
      en: {
        todo: {
          title: "To-do List",
          add: "Add",
          all: "All",
          completed: "Completed",
          uncompleted: "Uncompleted",
          delete: "Delete",
          placeholder: "Add a new todo",
          deleteAll: "Delete all todo",
        },
      },
      zh: {
        todo: {
          title: "待辦事項",
          add: "新增",
          all: "全部",
          completed: "已完成",
          uncompleted: "未完成",
          delete: "刪除",
          placeholder: "新增待辦事項",
          deleteAll: "刪除全部內容",
        },
      },
    },
  });

  nuxtApp.vueApp.use(i18n);
});
