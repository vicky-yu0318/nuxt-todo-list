<template>
    <div class="todo-app">
        <section class="section-locale">
            <select v-model="currentLocale" @change="switchLocale">
                <option v-for="locale in locales" :key="locale.code" :value="locale.code">
                    {{ locale.name }}
                </option>
            </select>
        </section>
        <section>
            <div class="container">
                <div class="header-todo">
                    <h1>{{ $t('todo.title') }}</h1>
                    <div>
                        <input v-model.trim="newTodo" :placeholder="$t('todo.placeholder')" />
                        <button @click="addTodo" class="btn">{{ $t('todo.add') }}</button>
                    </div>
                    <div class="wrap-btn-category">
                        <div class="btn-category">
                            <button :class="{ 'btn-active': category === 'all' }" @click="category = 'all'">{{
                                $t('todo.all') }}</button>
                            <button :class="{ 'btn-active': category === 'completed' }" @click="category = 'completed'">{{
                                $t('todo.completed')
                            }}</button>
                            <button :class="{ 'btn-active': category === 'uncompleted' }"
                                @click="category = 'uncompleted'">{{
                                    $t('todo.uncompleted')
                                }}</button>
                        </div>
                    </div>
                </div>
                <div class="todo-list" :class="{ active: filteredTodoList.length > 0 }">
                    <ul>
                        <li v-for="todo in filteredTodoList" :key="todo.id">
                            <div>
                                <input type="checkbox" v-model="todo.isCompleted" @change="updateTodo(todo)" />
                                <span :class="{ completed: todo.isCompleted }">{{ todo.text }}</span>
                            </div>
                            <button @click="removeTodo(todo.id)" class="btn">{{ $t('todo.delete') }}</button>
                        </li>
                    </ul>
                </div>
                <button @click="removeAllTodo()"
                    :style="{ display: filteredTodoList.length > 0 ? 'block' : 'none', marginTop: '10px' }">{{
                        $t('todo.deleteAll') }}</button>
            </div>
        </section>
    </div>
</template>
  
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useNuxtApp } from '#app';
import { useI18n } from 'vue-i18n'
// import { useAxios } from '@nuxtjs/axios';

interface TodoList {
    id: number;
    text: string;
    isCompleted: boolean;
}
// ========================================
const { locale } = useI18n()
const locales = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' }
]
const currentLocale = ref(locale.value)
// const currentLocale = ref(localStorage.getItem('locale') || 'zh');

// onMounted 時間差
if (process.client) {
    const locale = ('locale') || 'zh';
    currentLocale.value = locale;
}

const switchLocale = () => {
    locale.value = currentLocale.value
    if (process.client) {
        localStorage.setItem('locale', currentLocale.value)
    }
}

watch(currentLocale, (newLocale) => {
    locale.value = newLocale
    if (process.client) {
        localStorage.setItem('locale', newLocale)
    }
}, { immediate: true })
// ========================================
// const axios = useAxios();
const { $axios } = useNuxtApp();
const newTodo = ref('');
const todoList = ref<TodoList[]>([]);
const category = ref('all');

onMounted(() => {
    getTodos();
})

const getTodos = async () => {
    const res = await $axios.get('/todos');
    todoList.value = res.data;
};

const addTodo = async () => {
    if (newTodo.value) {
        await $axios.post('/todos', {
            id: Date.now(),
            text: newTodo.value,
            isCompleted: false,
        });
        getTodos();
        newTodo.value = '';
    }
};

const updateTodo = async (todo: TodoList) => {
    await $axios.put(`/todos/${todo.id}`, todo);
    getTodos();
};

const removeTodo = async (id: number) => {
    await $axios.delete(`/todos/${id}`);
    getTodos();
};

const removeAllTodo = async () => {
    // await $axios.delete(`/todos/`); //JSON server 沒有此方法
    // 逐一刪除每筆記錄
    const deletePromises = todoList.value.map(todo => $axios.delete(`/todos/${todo.id}`));
    await Promise.all(deletePromises);
    getTodos();
}

const filteredTodoList = computed(() => {
    switch (category.value) {
        case 'completed':
            return todoList.value.filter(todo => todo.isCompleted);
        case 'uncompleted':
            return todoList.value.filter(todo => !todo.isCompleted);
        default:
            return todoList.value;
    }
});

</script>
  

<style scoped>
.section-locale {
    margin: 15px;
}

.wrap-todo-app {
    display: flex;
    justify-content: center;
    align-items: center;
}

.todo-app .container {
    width: 50%;
    margin: auto;
    max-width: 600px;
}

@media screen and (max-width: 768px) {
    .todo-app .container {
        width: 90%;
    }
}

.btn {
    margin-left: 10px;
    cursor: pointer;
}

.btn-active {
    background-color: #fa0;
    border: .5px solid #ccc;
}

.completed {
    text-decoration: line-through;
}

.header-todo {
    text-align: center;
}

.wrap-btn-category {
    margin: 20px 0;
}

.btn-category {
    width: 35%;
    display: flex;
    justify-content: space-around;
}

.wrap-btn-category button {
    cursor: pointer;
}


@media screen and (max-width: 768px) {
    .btn-category {
        width: 70%;
        justify-content: start;
    }
}

.todo-list {
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
}

.todo-list.active {
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 0 8px;
}

.todo-list ul {
    padding-left: 0;
}

.todo-list li {
    margin-bottom: 5px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
</style>
