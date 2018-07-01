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
        console.log('componentDidMount App');

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

            console.log('tasks -', tasks);
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
                posts: [tasks, ...prevState.tasks],
            }));
        } catch ({ errorMessage }) {
            console.error(errorMessage);
        } finally {
            this._setTasksFetchingState(false);
        }
    };
    _handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(`handleFormSubmit`);
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
        const { _createTasksAsync } = this.props;

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
    render () {
        // console.log('Render State -', this.state);
        const { tasks: userTasks, isSpinning, message } = this.state;
        console.log('Render isSpinning - ', isSpinning);
        console.log('Render message - ', message);
        const showTasks = userTasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
            />
        ));

        console.log(`showTasks - `, showTasks);

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
                            <ul><div>{showTasks}</div></ul>
                        </div>

                    </section>

                </main>
            </section>
        );
    }
}
