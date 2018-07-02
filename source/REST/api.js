import { MAIN_URL, TOKEN } from './config';
export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error("Tasks Where not loaded");
        }
        const { data: tasks } = await response.json();

        return tasks;
    },
    async createTasks (taskName) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message: taskName }),
        });

        if (response.status !== 200) {
            throw new Error("Tasks Where not Create");
        }
        const { data: task } = await response.json();

        return task;
    },
    async putTasks (task) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message: task }),
        });

        if (response.status !== 200) {
            throw new Error("Tasks Where not Create");
        }
        const { data: tasks } = await response.json();

        return tasks;
    },
    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error("Task not delete");
        }
    },

};
























