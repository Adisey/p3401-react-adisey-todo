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
            console.error(`Error response - `, response);
            throw new Error("Tasks Where not loaded");
        }
        const { data: tasks } = await response.json();

        return tasks;
    },
    async createTask (taskName) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message: taskName }),
        });

        if (response.status !== 200) {
            console.error(`Error response - `, response);
            throw new Error("Tasks Where not Create");
        }
        const { data: task } = await response.json();
        return task;
    },
    async updateTask (updTask) {
        // console.log(`putTask received - `, updTask);
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body: JSON.stringify(updTask),
        });

        if (response.status !== 200) {
            console.error(`Error response - `, response);
            throw new Error("Tasks Where not Update");
        }
        const { data: tasks } = await response.json();

        return tasks;
    },

    async completeAllTasks  (updTasks) {
        // Фековый Api исключительно для тестов, логика предусматривает другой алгоритм перевода
        // всех задач в статус выполнено ;)
        // В таком виде как есть можно использовать для обовления всех задач на сервере из стейта ;)

        await Promise.all(updTasks.map(async (updTask) => {

            const response = await fetch(MAIN_URL, {
                method:  "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:  TOKEN,
                },
                body: JSON.stringify(updTask),
            });

            if (response.status !== 200) {
                console.error(`Error response - `, response);
                throw new Error("Tasks Where not Update");
            }

        })).then((results) => {
            console.log(`Выполнен перевод всех задач в статус выполнено.${results}. А точнее все оновлены на сервере. ;)`);
        });
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            console.error(`Error response - `, response);
            throw new Error("Task not delete");
        }
    },

};
