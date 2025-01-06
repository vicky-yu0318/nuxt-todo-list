<template>
    <div>
      <h1>註冊表單</h1>
      <form @submit.prevent="onSubmit">
        <!-- 用戶名 -->
        <div>
          <label for="username">用戶名</label>
          <input id="username" v-model="username" type="text" />
          <span>{{ errors.username }}</span>
        </div>
  
        <!-- 密碼 -->
        <div>
          <label for="password">密碼</label>
          <input id="password" v-model="password" type="password" />
          <span>{{ errors.password }}</span>
        </div>
  
        <!-- 提交按鈕 -->
        <button type="submit">提交</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { useForm, useField } from "vee-validate";
  import * as yup from "yup"; // https://www.npmjs.com/package/yup
   
  
  // 定義表單結構與驗證規則
  const schema = yup.object({
    username: yup.string().required("用戶名為必填項").min(3, "用戶名至少需 3 個字元"),
    password: yup.string().required("密碼為必填項").min(6, "密碼至少需 6 個字元"),
  });
  
  // 使用 useForm 管理表單
  const { handleSubmit, errors } = useForm({
    validationSchema: schema,
  });
  
  // 定義表單字段
  const { value: username } = useField("username");
  const { value: password } = useField("password");
  
  // 表單提交處理
  const onSubmit = handleSubmit((values) => {
    console.log("表單提交成功", values);
  });
  </script>
  
  <style scoped>
  span {
    color: red;
    font-size: 0.9em;
  }
  </style>
  