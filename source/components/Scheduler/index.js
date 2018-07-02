// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST/api';
import Spinner from '../Spinner';
import Task from '../Task';

export default class Scheduler extends Component {
    state = {
        tasks:      [],
        message:    '',
        isSpinning: false,
    };

    componentDidMount () {
        // console.log('componentDidMount App');

        // Временно прикручен спинер, потом убрать и включить для асинхроннвх операций обращения к серверу.
        // this.setState({ isSpinning: true });
        // setTimeout(() => {
        //     this.setState({ isSpinning: false });
        // }, 6000);

        this._fetchTasksAsync();

    }

    _fetchTasksAsync = async () => {
        // Получение тасков с сервера
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.fetchTasks();
            // console.log('tasks -', tasks);

            this.setState({
                tasks,
            });

        } catch ({ message }) {
            console.error(message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTasksAsync = async (message) => {
        // console.log(`_createTasksAsync`);
        // console.log(`_createTasksAsync message`, message);
        try {
            this._setTasksFetchingState(true);
            const tasks = await api.createTasks(message);

            this.setState((prevState) => ({
                tasks: [tasks, ...prevState.tasks],
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };
    _handleFormSubmit = (e) => {
        e.preventDefault();
        // console.log(`handleFormSubmit`);
        this._submitTask();
    };
    _updateTask = (e) => {
        const { value } = e.target;
        // console.log('message value - ', value);

        this.setState({ message: value });
    };
    _submitTask = () => {
        // console.log(`_submitTask`);
        // console.log('_submitCommen - State ', this.state);
        const { message } = this.state;
        // console.log('Submit message - ', message);

        if (!message) {
            return null;
        }

        // TODO Кажется эта строка тут не нужна!
        // const { _createTasksAsync } = this.props;

        this._createTasksAsync(message);
        this.setState({ message: "" });
    };
    _setTasksFetchingState = (isSpinning) => {
        this.setState({
            isSpinning,
        });
    };

    _submitTaskOnEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("Enter");
            this._submitTask();
        }
    };

    _removeTasktAsync = async (id) => {
        // console.log(`Start - _removeTasktAsync`);
        try {
            this._setTasksFetchingState(true);
            await api.removeTask(id);
            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
            // console.log(`End - _removeTasktAsync`);
        }
    };
    _updateDBTaskAsync = async (updTask) => {
        try {
            this._setTasksFetchingState(true);
            await api.putTasks([updTask]);
        } catch (response) {
            console.error(response);
        } finally {
            this._setTasksFetchingState(false);
        }
    };
    _updateSateTask = (updTask) => {
        const id = updTask.id;

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id === id ? updTask : task),
        }));
    };

    _updateSateAndDB = (updTask) => {
        this._updateSateTask(updTask);
        this._updateDBTaskAsync(updTask);
        // Масло масляное, но мне кажется так выглядит более целсно. Дергаешь себе только одну функцию. ;)
    };

    _favoriteTask = (id) => {
        const { tasks } = this.state;
        const currentTask = tasks.filter((task) => task.id === id);

        if (currentTask.length) {
            let {
                message,
                completed,
                favorite,
            } = currentTask[0];

            favorite = !favorite;
            const updTask = {
                id,
                message,
                completed,
                favorite,
            };

            this._updateSateAndDB(updTask);
        } else {
            console.error(`Task id ${id} not found.`);
        }
    };


    render () {
        // console.log('Render State -', this.state);
        const { tasks: userTasks, isSpinning, message } = this.state;

        // console.log('Render isSpinning - ', isSpinning);
        // console.log('Render message - ', message);
        const showTasks = userTasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _favoriteTask = { this._favoriteTask }
                _removeTasktAsync = { this._removeTasktAsync }
            />
        ));

            // console.log(`showTasks - `, showTasks);
            // console.log('this.state', this.state);
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isSpinning } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'searh' value = '' />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { message }
                                onChange = { this._updateTask }
                                onKeyPress = { this._submitTaskOnEnter }
                            />
                            <button type = 'submit' >Добавить задачу</button>
                        </form>
                        <div>
                            {/*<Task />*/}
                            <ul><n>{showTasks}</n></ul>
                        </div>

                    </section>

                </main>
            </section>
        );
    }
}
