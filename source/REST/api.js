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
    async createTasks (message) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error("Tasks Where not Create");
        }
        const { data: tasks } = await response.json();

        return tasks;
    },


};
























